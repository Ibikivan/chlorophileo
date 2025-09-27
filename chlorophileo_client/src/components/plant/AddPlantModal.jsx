import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { addPlant } from "../../utils/api/api";
import { useAppStore } from "../../app/store";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddPlantModal() {
    const [formData, setFormData] = useState({
        name: "",
        waterAmount: "",
        frequency: "",
        imageUrl: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const queryClient = useQueryClient();
    const pushToast = useAppStore.use.pushToast();
    const navigate = useNavigate();
    const location = useLocation();

    const { mutate: createPlant, isLoading } = useMutation(addPlant, {
        onSuccess: () => {
            pushToast({ message: "Plante ajoutée avec succès!", type: "success" });
            queryClient.invalidateQueries("plants");
            // Reset form
            setFormData({ name: "", waterAmount: "", frequency: "", imageUrl: null });
            cleanupPreview();
            // Close modal
            document.getElementById("add_plant_modal").checked = false;
            // Navigate if not on home
            if (location.pathname !== "/") {
                navigate("/");
            }
        },
        onError: (error) => {
            pushToast({
                message: error?.response?.data?.message || "Erreur lors de l'ajout de la plante.",
                type: "error"
            });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('waterAmount', Number(formData.waterAmount));
        formDataToSend.append('frequency', Number(formData.frequency));
        if (formData.imageUrl) {
            formDataToSend.append('imageUrl', formData.imageUrl);
        }
        createPlant(formDataToSend);
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            if (file) {
                setFormData(prev => ({
                    ...prev,
                    [name]: file
                }));
                // Create preview URL
                const previewUrl = URL.createObjectURL(file);
                setImagePreview(previewUrl);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Cleanup preview URL when component unmounts or when modal closes
    const cleanupPreview = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
    };

    return (
        <>
            <input type="checkbox" id="add_plant_modal" className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="text-lg font-bold mb-4">Ajouter une plante</h3>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="form-control w-full">
                            <label className="label" htmlFor="imageUrl">
                                <span className="label-text">Image de la plante</span>
                            </label>
                            <input
                                type="file"
                                id="imageUrl"
                                name="imageUrl"
                                onChange={handleChange}
                                className="file-input file-input-bordered w-full"
                                accept="image/*"
                                required
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={imagePreview}
                                        alt="Aperçu"
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-control w-full">
                            <label className="label" htmlFor="name">
                                <span className="label-text">Nom de la plante</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label" htmlFor="waterAmount">
                                <span className="label-text">Quantité d'eau (L)</span>
                            </label>
                            <input
                                type="number"
                                id="waterAmount"
                                name="waterAmount"
                                value={formData.waterAmount}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                required
                                min="0"
                                step="0.1"
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label" htmlFor="frequency">
                                <span className="label-text">Fréquence (heures)</span>
                            </label>
                            <input
                                type="number"
                                id="frequency"
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                required
                                min="1"
                            />
                        </div>

                        <div className="modal-action">
                            <label htmlFor="add_plant_modal" className="btn">Annuler</label>
                            <button 
                                type="submit" 
                                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                                disabled={isLoading}
                            >
                                Ajouter
                            </button>
                        </div>
                    </form>
                </div>
                <label className="modal-backdrop" htmlFor="add_plant_modal">Close</label>
            </div>
        </>
    );
}
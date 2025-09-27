import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { getPlantById, getPlantWaterings, waterPlant } from "../../utils/api/api";
import { useAppStore } from "../../app/store";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect } from "react";
import addIcon from "../../assets/addIcon.svg"
import AddPlantModal from "../../components/plant/AddPlantModal";

export default function PlantDetails() {
    const { id } = useParams();
    const pushToast = useAppStore.use.pushToast();
    const queryClient = useQueryClient();
    const setFabConfig = useAppStore.use.setFabConfig()

    // Water plant mutation
    const { mutate: waterThisPlant, isLoading: isWatering } = useMutation(
        (wateringId) => waterPlant(wateringId),
        {
            onSuccess: (data) => {
                pushToast({ message: "Plante arrosée avec succès!", type: 'success' });
                queryClient.invalidateQueries(['waterings', id]);
            },
            onError: (error) => {
                pushToast({ 
                    message: error?.response?.data?.message || "Erreur lors de l'arrosage.", 
                    type: 'error' 
                });
            }
        }
    );

    // Fetch plant details
    const { 
        data: plant,
        isLoading: isLoadingPlant,
        error: plantError
    } = useQuery(['plant', id], () => getPlantById(id), {
        retry: false
    });

    // Fetch watering history
    const {
        data: waterings,
        isLoading: isLoadingWaterings,
        error: wateringsError
    } = useQuery(['waterings', id], () => getPlantWaterings(id), {
        retry: false
    });

    if (plantError || wateringsError) {
        const error = plantError || wateringsError;
        pushToast({ 
            message: error?.response?.data?.message || "An error occurred.", 
            type: 'error' 
        });
    }

    useEffect(() => {
        setFabConfig({
            icon: addIcon,
            onClick: () => document.getElementById("add_plant_modal").checked = true,
            isVisible: true
        })
        return () => setFabConfig(null)
    }, [])

    if (isLoadingPlant || isLoadingWaterings) {
        return <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner"></span>
        </div>;
    }

    const statusColors = {
        'Missed': {color: 'badge-error', name: 'Manqué'},
        'Completed': {color: 'badge-success', name: 'Arrosée'},
        'Pending': {color: 'badge-warning', name: 'En cours'}
    };

    return <div className="flex flex-col items-center p-4 gap-4">
        <AddPlantModal />
        <h2 className="text-xl text-gray-700 pb-7 pt-4 px-4 self-start">{plant.name}</h2>

        <div className="card bg-base-100 w-96 shadow-xl">
            <figure className="px-4 pt-4">
                <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="rounded-xl h-64 w-full object-cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {plant.name}
                    <div className="badge badge-primary">{plant.species}</div>
                </h2>
                <div className="flex flex-col gap-2">
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Quantité d'eau</div>
                            <div className="stat-value">{plant.waterAmount}L</div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Fréquence</div>
                            <div className="stat-value">
                                {plant.frequency}h
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title">Prochain arrosage</h2>
                    <button 
                        className={`btn btn-primary btn-sm ${isWatering ? 'loading' : ''}`}
                        onClick={() => waterThisPlant(waterings[0]?.id)}
                        disabled={isWatering}
                    >
                        {!isWatering && <span className="icon-[line-md--water-small]"></span>}
                        Arroser
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    {waterings?.map((watering) => (
                        <div key={watering.id} 
                            className="flex justify-between items-center p-2 bg-base-200 rounded-lg">
                            <div>
                                {format(new Date(watering.date), "dd MMM yyyy HH:mm", { locale: fr })}
                            </div>
                            <div className={`badge ${statusColors[watering.status]?.color}`}>
                                {statusColors[watering.status]?.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>;
}
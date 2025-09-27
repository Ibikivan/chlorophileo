import { useQuery } from "react-query";
import { useAppStore } from "../../app/store";
import { toBoolean } from "../../utils/helper";
import { useEffect, useState } from "react";
import { getAllPlants } from "../../utils/api/api";
import { useNavigate } from "react-router-dom";
import addIcon from "../../assets/addIcon.svg"
import AddPlantModal from "../plant/AddPlantModal";

export default function UserHome() {

    const setFabConfig = useAppStore.use.setFabConfig()
    const [queries, setQueries] = useState({})
    const pushToast = useAppStore.use.pushToast()
    const navigate = useNavigate()
    const queryKey = ['plants']

    let retry = import.meta.env.VITE_RETRY_LIMIT
    if (retry === "false") {
        retry = toBoolean(retry)
    } else {
        retry = parseInt(retry) || 2
    }
    const { isLoading, error, data } = useQuery(queryKey, () => getAllPlants(queries), {
        retry: retry || false
    })
    const plants = data?.data || []

    useEffect(() => {
        setFabConfig({
            icon: addIcon,
            onClick: () => document.getElementById("add_plant_modal").checked = true,
            isVisible: true
        })
        return () => setFabConfig(null)
    }, [])

    if (error) pushToast({ message: error?.response?.data?.message || "An error occured.", type: 'error' })

    function handlePlantClick(plantId) {
        navigate(`details/${plantId}`)
    }

    return <div className="flex flex-col items-center grow p-4">
        <AddPlantModal />
        <h2 className="text-xl text-gray-700 pb-7 pt-4 px-4 self-start">Mes plantes</h2>

        <div className="container m-auto max-w-130">
            {isLoading
                ? <span className="loading loading-spinner ml-4"></span>
                : <ul className="list bg-base-100 rounded-box shadow-md glass">
                    {plants.map((plant, index) => (
                        <li
                            key={`${index}-${plant.id}`}
                            className="list-row cursor-pointer hover:bg-gray-100 transition-all"
                            onClick={() => handlePlantClick(plant.id)}
                        >
                            <div><img className="size-10 rounded-box" src={plant.imageUrl}/></div>
                            <div>
                                <div>{plant.name}</div>
                                <div className="text-xs uppercase font-semibold opacity-60">{plant.species}</div>
                            </div>
                            <div className="font-semibold">
                                <p>Eau: <span>{plant.waterAmount}</span>L</p>
                            </div>
                            <div className="font-semibold">
                                <p>Tous les {plant.frequency}h</p>
                            </div>
                        </li>
                    ))}
                </ul>
            }
        </div>
    </div>
}

import { toast } from "react-hot-toast";

function ExampleComponent() {
    const handleSuccess = () => {
        toast.success("Opération réussie!", {
            duration: 4000,
            style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
            },
        });
    };

    const handleError = () => {
        toast.error("Une erreur est survenue!");
    };

    const handleCustom = () => {
        toast("Message personnalisé", {
            icon: "👏",
            duration: 4000,
            style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
            },
        });
    };

    return (
        <div>
            <button onClick={handleSuccess}>Succès</button>
            <button onClick={handleError}>Erreur</button>
            <button onClick={handleCustom}>Custom</button>
        </div>
    );
}

export default ExampleComponent;

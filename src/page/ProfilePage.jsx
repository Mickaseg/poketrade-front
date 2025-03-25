import { useState } from "react";
import { Lock, Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
    // État pour stocker les informations du profil
    const [profileData, setProfileData] = useState({
        nom: "John Doe",
        email: "john@example.com",
        bio: "Développeur passionné",
        avatar: "https://via.placeholder.com/150",
    });

    // Gestionnaire de modification des champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        // Conteneur principal avec padding et centrage
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Barre de navigation fixe */}

            {/* Section du profil */}
            <div className="mt-8">
                <div className="relative">
                    {/* <div className="h-48 w-full bg-gradient-to-r from-primary-600 to-primary-800 rounded-t-2xl"></div> */}
                    <div className="absolute -bottom-16 left-8">
                        <div className="flex flex-col items-center gap-4">
                            <div
                                className="relative group"
                                style={{ width: "128px", height: "128px" }}
                            >
                                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-camera w-8 h-8 text-gray-400"
                                    >
                                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                                        <circle cx="12" cy="13" r="3"></circle>
                                    </svg>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-white text-sm">
                                       <Camera />
                                    </button>
                                </div>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-b-2xl shadow-sm">
                    <div className="pt-20 pb-6 px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                   {profileData.nom}
                                </h1>
                                <div className="mt-1 flex items-center gap-2 text-gray-500">
                                    <Mail />
                                    <span>{profileData.email}</span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                Membre depuis mars 2025
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulaire de profil */}
            <form className="mt-8 space-y-6">
                <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="border-b border-gray-100">
                        <div className="px-8 py-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-user w-5 h-5 text-primary-500"
                                >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                Informations du profil
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Personnalisez votre identité sur la plateforme.
                            </p>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Nom d'utilisateur
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="username"
                                        type="text"
                                        className="pl-10 pr-10 block w-full rounded-md shadow-sm text-sm border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                                        placeholder="Choisissez un nom d'utilisateur"
                                        required
                                        minLength="3"
                                        maxLength="30"
                                        pattern="^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$"
                                        title="Le nom d'utilisateur doit contenir entre 3 et 30 caractères (lettres, chiffres, - et _)"
                                        value="mickaelseguin1_a83579f9"
                                    />
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-check w-4 h-4 text-green-500"
                                        >
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-1 flex items-center text-sm">
                                    <span className="text-green-500">
                                        Disponible
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="friendId"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            ID-ami Pokémon (optionnel)
                                        </label>
                                        <button
                                            type="button"
                                            className="ml-2 text-gray-400 hover:text-gray-500"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-help-circle w-4 h-4"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                ></circle>
                                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                                <path d="M12 17h.01"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="mt-1">
                                        <input
                                            id="friendId"
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="XXXX-XXXX-XXXX-XXXX"
                                            className="block w-full rounded-md shadow-sm text-sm font-mono border-gray-300 focus:border-primary-600 focus:ring-primary-500"
                                            maxLength="19"
                                            value=""
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Vous pourrez l'ajouter plus tard dans
                                        votre profil
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="border-b border-gray-100">
                        <div className="px-8 py-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-eye w-5 h-5 text-primary-500"
                                >
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                Paramètres de confidentialité
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Gérez la visibilité de vos informations.
                            </p>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex-1">
                                <span className="block font-medium text-gray-900 text-sm">
                                    Visibilité de la collection
                                </span>
                                <p className="text-gray-500 text-sm">
                                    Permettre aux autres utilisateurs de voir
                                    votre collection de cartes
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                    </div>
                </section> */}

                {/* <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center px-8 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        Enregistrer les modifications
                    </button>
                </div> */}
            </form>

            <section className=" bg-white rounded-2xl shadow-sm overflow-hidden mt-8">
                <div className="border-b border-gray-100">
                    <div className="px-8 py-6">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Lock />    
                            Sécurité
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Gérez vos informations de connexion.
                        </p>
                    </div>
                </div>
                <div className="p-8">
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                            Changer le mot de passe
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="current-password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Mot de passe actuel
                                </label>
                                <input
                                    type="password"
                                    id="current-password"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    value=""
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="new-password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Nouveau mot de passe
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="password"
                                        id="new-password"
                                        required
                                        className="block w-full rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm border-gray-300 focus:border-indigo-500"
                                        value=""
                                    />
                                    <div className="mt-1 flex items-center gap-2"></div>
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Confirmer le nouveau mot de passe
                                </label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    required
                                    className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm border-gray-300 focus:border-indigo-500"
                                    value=""
                                />
                            </div>
                            <div>
                                <button
                                    type="button"
                                    disabled
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Modifier le mot de passe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;

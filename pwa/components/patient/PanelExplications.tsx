export function PanelExplications(){
  return(
    <div className="mb-10 flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:px-20">
      <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
        <strong>Bienvenue dans votre Espace Personnel</strong>
      </p>
      <p className={'text-lg'}>
        Cet espace vous est dédié pour <strong>préparer votre intervention</strong>. Vous y trouverez des <strong>vidéos explicatives</strong> sur votre intervention et votre hospitalisation. Nous vous invitons à les visionner et vous pouvez revenir sur votre espace pour les revoir à tout moment.
      </p>

      <p className={'text-lg'}>
        Merci également de <strong>remplir les formulaires</strong> nécessaires à votre dossier médical. Ceux-ci sont cruciaux pour une prise en charge adaptée et sécurisée.
      </p>

      <p className={'text-lg'}>
        Votre préparation et votre compréhension sont clés pour nous. Ensemble, faisons de cette étape une réussite.
      </p>

    </div>
  );
}

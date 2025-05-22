import CardItem from "../../Components/Common/Card";
import { Typography } from "antd";
import bacDefinitif from "./assets/bac-definitif.jpg"; 

const { Title } = Typography;

export const MakeRequests = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Documents à retirer physiquement (sur rendez-vous)</Title>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
        <CardItem
          title="Retrait définitif du baccalauréat"
          description="Demandez une date de retrait définitif."
          imageUrl={bacDefinitif}
          onClick={() => console.log("Retrait définitif du bac")}
        />
        <CardItem
          title="Retrait temporaire du baccalauréat"
          description="Demandez un retrait temporaire avec date de retour."
          imageUrl="/images/bac-temporaire.png"
          onClick={() => console.log("Retrait temporaire du bac")}
        />
        <CardItem
          title="Retrait de la carte d’étudiant"
          description="Vérifiez la disponibilité puis prenez rendez-vous."
          imageUrl="/images/carte-etudiant.png"
          onClick={() => console.log("Retrait carte étudiant")}
        />
        <CardItem
          title="Retrait de diplômes"
          description="DEUG, Licence… demandez un rendez-vous pour retrait."
          imageUrl="/images/diplome.png"
          onClick={() => console.log("Retrait de diplôme")}
        />
      </div>

      <Title level={3}>Documents imprimables instantanément</Title>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <CardItem
          title="Relevé de notes"
          description="Générez et imprimez instantanément."
          imageUrl="/images/releve-notes.png"
          onClick={() => console.log("Relevé de notes")}
        />
        <CardItem
          title="Attestation de réussite"
          description="Téléchargez une attestation selon votre diplôme."
          imageUrl="/images/reussite.png"
          onClick={() => console.log("Attestation de réussite")}
        />
        <CardItem
          title="Attestation de scolarité"
          description="Téléchargeable et imprimable sans rendez-vous."
          imageUrl="/images/scolarite.png"
          onClick={() => console.log("Attestation de scolarité")}
        />
      </div>
    </div>
  );
};

export default MakeRequests;

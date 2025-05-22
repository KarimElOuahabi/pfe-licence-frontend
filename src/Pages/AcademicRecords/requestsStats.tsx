import { TableColumnsType } from "antd";
import DataTable from "../../Components/Common/DataTable";

export interface Request {
  id: number;
  name: string;
  description: string;
  status: "Pending" | "Ready";
  requestDate: string;
  retrieveDate?: string;
}

export const mockRequests: Request[] = [
  {
    id: 1,
    name: "Retrait définitif du baccalauréat",
    description: "Demande de retrait définitif du diplôme du baccalauréat.",
    status: "Pending",
    requestDate: "2025-05-01",
    retrieveDate: "",
  },
  {
    id: 2,
    name: "Attestation de réussite",
    description: "Générée automatiquement depuis la plateforme.",
    status: "Ready",
    requestDate: "2025-04-20",
    retrieveDate: "2025-04-20",
  },
  {
    id: 3,
    name: "Carte d’étudiant",
    description: "Demande de retrait de la carte d’étudiant.",
    status: "Ready",
    requestDate: "2025-04-25",
    retrieveDate: "2025-05-05",
  },
];

export const columns: TableColumnsType<Request> = [
  { title: "Nom de la demande", dataIndex: "name", key: "name" },
  { title: "Date de la demande", dataIndex: "requestDate", key: "requestDate" },
  {
    title: "Date de retrait",
    dataIndex: "retrieveDate",
    key: "retrieveDate",
    render: (text) => text || "—",
  },
  {
    title: "Statut",
    dataIndex: "status",
    key: "status",
    render: (status) =>
      status === "Ready" ? "Prête à retirer" : "En attente de traitement",
  },
];

export const RequestsStats = () => {
  return (
    <div>
      <h2>Statut des demandes académiques</h2>
      <DataTable columns={columns} data={mockRequests} expandable={{}} />
    </div>
  );
};

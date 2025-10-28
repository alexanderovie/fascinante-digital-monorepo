/**
 * Audit Process Data
 * Used in AuditProcess component
 */

export interface ProcessStep {
  id: number;
  title: string;
}

export const auditProcessSteps: ProcessStep[] = [
  {
    id: 1,
    title: "Completa el Formulario",
  },
  {
    id: 2,
    title: "Analizamos en Segundos",
  },
  {
    id: 3,
    title: "Recibe Tu Reporte",
  },
];


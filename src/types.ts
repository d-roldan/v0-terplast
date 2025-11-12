export type ProcessStatus = "idle" | "filling" | "stopped"
export type Format = "1lt" | "4lt" | "5kg" | "10kg" | "20kg" | "25kg"

export interface ProcessData {
  of: string
  material: string
  description: string
  format: Format
  legajo: string
  ordenEnvasado: string
  targetQuantity: number
  gpm: number
}

export interface TankState {
  status: ProcessStatus
  weight: number
  counter: number
  chartData: Array<{ x: number; y: number }>
  processData: ProcessData | null
  previousFormat?: Format
  startTime?: number
}

export interface PackagingSummary {
  id: string
  tankNumber: number
  startTime: Date
  endTime: Date
  processData: ProcessData
  totalUnits: number
  withinTolerance: number
  inAlert: number
  outOfTolerance: number
  averageWeight: number
  minWeight: number
  maxWeight: number
}

export interface ProcessMetrics {
  startTime: Date
  withinTolerance: number
  inAlert: number
  outOfTolerance: number
  weights: number[]
}

"use client"

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts"
import type { Format } from "./tank-control"

interface WeightChartProps {
  data: Array<{ x: number; y: number }>
  format: Format
  previousFormat?: Format
}

const formatWeights = {
  "5kg": 5,
  "10kg": 10,
  "20kg": 20,
  "25kg": 25,
}

export function WeightChart({ data, format, previousFormat }: WeightChartProps) {
  const activeFormat = data.length > 0 && previousFormat ? previousFormat : format
  const nominalWeight = formatWeights[activeFormat]
  const tolerance = nominalWeight * 0.02 // 2% de tolerancia

  const minWeight = nominalWeight - tolerance * 2
  const maxWeight = nominalWeight + tolerance * 2

  // Clasificar puntos por color
  const greenData = data.filter((p) => p.y >= nominalWeight - tolerance && p.y <= nominalWeight + tolerance)
  const yellowData = data.filter(
    (p) =>
      (p.y >= nominalWeight - tolerance * 2 && p.y < nominalWeight - tolerance) ||
      (p.y > nominalWeight + tolerance && p.y <= nominalWeight + tolerance * 2),
  )
  const redData = data.filter((p) => p.y < nominalWeight - tolerance * 2 || p.y > nominalWeight + tolerance * 2)

  return (
    <div className="bg-[#1a1e25] rounded-2xl p-6 border border-[#3a3e45]">
      <h3 className="text-cyan-400 text-xl font-bold mb-4 text-center">Gráfico de Control de Peso</h3>

      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3a3e45" />
          <XAxis
            type="number"
            dataKey="x"
            name="Muestra"
            stroke="#e3e3e3"
            label={{ value: "Número de Muestra", position: "insideBottom", offset: -10, fill: "#e3e3e3" }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Peso"
            stroke="#e3e3e3"
            domain={[minWeight - 1, maxWeight + 1]}
            tickFormatter={(value) => `${value.toFixed(2)}`}
            label={{ value: "Peso [kg]", angle: -90, position: "insideLeft", fill: "#e3e3e3" }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{ backgroundColor: "#1a1e25", border: "1px solid #3a3e45", borderRadius: "8px" }}
            labelStyle={{ color: "#e3e3e3" }}
            formatter={(value: number) => [`${value.toFixed(2)} kg`, "Peso"]}
          />

          {/* Bandas de color */}
          <ReferenceArea
            y1={nominalWeight - tolerance}
            y2={nominalWeight + tolerance}
            fill="#22c55e"
            fillOpacity={0.2}
          />
          <ReferenceArea
            y1={nominalWeight - tolerance * 2}
            y2={nominalWeight - tolerance}
            fill="#eab308"
            fillOpacity={0.2}
          />
          <ReferenceArea
            y1={nominalWeight + tolerance}
            y2={nominalWeight + tolerance * 2}
            fill="#eab308"
            fillOpacity={0.2}
          />
          <ReferenceArea y1={minWeight - 1} y2={nominalWeight - tolerance * 2} fill="#ef4444" fillOpacity={0.2} />
          <ReferenceArea y1={nominalWeight + tolerance * 2} y2={maxWeight + 1} fill="#ef4444" fillOpacity={0.2} />

          {/* Línea de referencia nominal */}
          <ReferenceLine y={nominalWeight} stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" />

          {/* Puntos de datos */}
          <Scatter name="Dentro" data={greenData} fill="#22c55e" />
          <Scatter name="Alerta" data={yellowData} fill="#eab308" />
          <Scatter name="Fuera" data={redData} fill="#ef4444" />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Leyenda */}
      <div className="flex justify-center gap-8 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-300">
            Dentro ({(nominalWeight - tolerance).toFixed(2)}–{(nominalWeight + tolerance).toFixed(2)} kg)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-gray-300">
            Alerta ({(nominalWeight - tolerance * 2).toFixed(2)}–{(nominalWeight - tolerance).toFixed(2)} /{" "}
            {(nominalWeight + tolerance).toFixed(2)}–{(nominalWeight + tolerance * 2).toFixed(2)} kg)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-300">
            Fuera ({"<"}
            {(nominalWeight - tolerance * 2).toFixed(2)} / {">"}
            {(nominalWeight + tolerance * 2).toFixed(2)} kg)
          </span>
        </div>
      </div>
    </div>
  )
}

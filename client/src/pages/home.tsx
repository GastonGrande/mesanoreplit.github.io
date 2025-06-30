import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import ConsultationForm from "@/components/consultation-form";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Calendar className="text-primary text-2xl h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Consulta de Período</h1>
          <p className="text-gray-600">Selecciona el mes y año para tu consulta</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <ConsultationForm />
            
            {/* Info Card */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Información importante:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Los datos se procesarán automáticamente</li>
                    <li>Recibirás confirmación del envío</li>
                    <li>El año debe estar entre 2000 y 2099</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

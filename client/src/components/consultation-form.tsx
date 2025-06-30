import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, Calendar, Loader2 } from "lucide-react";

const consultationSchema = z.object({
  month: z.string().min(1, "Por favor selecciona un mes"),
  year: z.coerce.number()
    .int("El año debe ser un número entero")
    .min(2000, "El año debe ser mayor a 1999")
    .max(2099, "El año debe ser menor a 2100"),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

const months = [
  { value: "01", label: "01 - Enero" },
  { value: "02", label: "02 - Febrero" },
  { value: "03", label: "03 - Marzo" },
  { value: "04", label: "04 - Abril" },
  { value: "05", label: "05 - Mayo" },
  { value: "06", label: "06 - Junio" },
  { value: "07", label: "07 - Julio" },
  { value: "08", label: "08 - Agosto" },
  { value: "09", label: "09 - Septiembre" },
  { value: "10", label: "10 - Octubre" },
  { value: "11", label: "11 - Noviembre" },
  { value: "12", label: "12 - Diciembre" },
];

export default function ConsultationForm() {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      month: "",
      year: currentYear,
    },
  });

  const consultationMutation = useMutation({
    mutationFn: async (data: ConsultationFormData) => {
      const response = await apiRequest("POST", "/api/consultation", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Consulta enviada exitosamente",
        description: `Consulta para ${data.data.month}/${data.data.year} procesada correctamente`,
      });
      form.reset({ month: "", year: currentYear });
    },
    onError: (error: Error) => {
      console.error("Error sending consultation:", error);
      toast({
        title: "Error al enviar consulta",
        description: error.message || "Por favor intenta nuevamente",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ConsultationFormData) => {
    consultationMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Month Select */}
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Mes <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 bg-white text-gray-900 hover:border-gray-400">
                    <SelectValue placeholder="Selecciona un mes" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Year Input */}
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Año <span className="text-red-500">*</span>
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="number"
                    min="2000"
                    max="2099"
                    placeholder={currentYear.toString()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 bg-white text-gray-900 hover:border-gray-400 pr-10"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={consultationMutation.isPending}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {consultationMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <span>Enviar Consulta</span>
              <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

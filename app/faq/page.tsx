import Link from "next/link"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "¿Cómo funciona la alerta de emergencia?",
      answer: "Al presionar el botón de emergencia, tienes 5 segundos para cancelar. Si no cancelas, se envía automáticamente tu ubicación actual a todos tus contactos de emergencia configurados, junto con una alerta de que necesitas ayuda."
    },
    {
      question: "¿Mis datos personales están seguros?",
      answer: "Sí, todos tus datos están cifrados y se almacenan de forma segura. Solo tú y tus contactos de emergencia autorizados pueden acceder a tu información de ubicación cuando actives una alerta."
    },
    {
      question: "¿Puedo usar la app sin conexión a internet?",
      answer: "Algunas funciones básicas funcionan sin internet, pero para enviar alertas de emergencia y compartir ubicación necesitas conexión a internet o datos móviles."
    },
    {
      question: "¿Cómo agrego contactos de emergencia?",
      answer: "Ve a Configuración > Contactos de emergencia, o completa el proceso de registro donde puedes agregar hasta 5 contactos de confianza con sus números de teléfono."
    },
    {
      question: "¿Qué pasa si presiono el botón de emergencia por error?",
      answer: "Tienes 5 segundos para cancelar la alerta. Si se envía por error, puedes contactar inmediatamente a tus contactos para informarles que fue una falsa alarma."
    },
    {
      question: "¿La app consume mucha batería?",
      answer: "La app está optimizada para consumir poca batería. El rastreo de ubicación se puede pausar en cualquier momento desde la configuración si necesitas ahorrar batería."
    },
    {
      question: "¿Puedo reportar incidentes de forma anónima?",
      answer: "Sí, puedes elegir reportar incidentes de forma anónima. Sin embargo, para recibir seguimiento y apoyo, recomendamos proporcionar información de contacto."
    },
    {
      question: "¿Qué tipos de acoso puedo reportar?",
      answer: "Puedes reportar cualquier tipo de acoso: físico, verbal, sexual, cibernético, laboral, escolar, por discriminación, o cualquier situación que te haga sentir inseguro/a."
    },
    {
      question: "¿Los reportes llegan a las autoridades?",
      answer: "Los reportes se almacenan de forma segura y pueden ser compartidos con autoridades si así lo decides. También puedes usar la función de llamada directa al 911 para emergencias inmediatas."
    },
    {
      question: "¿Puedo usar la app en otros países?",
      answer: "La app funciona internacionalmente, pero los números de emergencia y recursos de apoyo están configurados para México. Estamos trabajando en expandir a otros países."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center mb-6">
            <Link href="/settings" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Preguntas Frecuentes</h1>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              Encuentra respuestas a las preguntas más comunes sobre Help me! y sus funcionalidades.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-green-200 rounded-xl px-4"
              >
                <AccordionTrigger className="text-left text-green-800 hover:text-green-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-medium text-blue-800 mb-2">¿No encontraste tu respuesta?</h3>
            <p className="text-sm text-blue-700 mb-3">
              Si tienes alguna pregunta que no está aquí, no dudes en contactarnos.
            </p>
            <div className="space-y-2">
              <Link href="/support">
                <button className="w-full text-left bg-white border border-blue-200 rounded-lg p-3 text-blue-700 hover:bg-blue-50">
                  Contactar soporte técnico
                </button>
              </Link>
              <Link href="/feedback">
                <button className="w-full text-left bg-white border border-blue-200 rounded-lg p-3 text-blue-700 hover:bg-blue-50">
                  Enviar comentarios
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

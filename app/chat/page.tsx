"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Phone, Video, Camera, Mic, MapPin, Image, Users, Plus, Circle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Contact {
  id: string
  name: string
  relationship: string
  phone: string
  avatar?: string
  isOnline: boolean
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'audio' | 'location'
  isRead: boolean
}

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  const emergencyContacts: Contact[] = [
    {
      id: "1",
      name: "María González",
      relationship: "Madre",
      phone: "+52 55 1234 5678",
      avatar: "/placeholder-user.jpg",
      isOnline: true,
      lastMessage: "¿Estás bien? Vi tu ubicación",
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 2
    },
    {
      id: "2", 
      name: "Carlos Pérez",
      relationship: "Hermano",
      phone: "+52 55 8765 4321",
      avatar: "/placeholder-user.jpg",
      isOnline: false,
      lastMessage: "Llámame cuando puedas",
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 0
    },
    {
      id: "3",
      name: "Ana López", 
      relationship: "Amiga",
      phone: "+52 55 9876 5432",
      avatar: "/placeholder-user.jpg",
      isOnline: true,
      lastMessage: "¿Necesitas que vaya?",
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 1
    }
  ]

  const messages: Message[] = [
    {
      id: "1",
      senderId: "1",
      content: "Hola, ¿cómo estás?",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      type: 'text',
      isRead: true
    },
    {
      id: "2",
      senderId: "me",
      content: "Bien, gracias por preguntar",
      timestamp: new Date(Date.now() - 50 * 60 * 1000),
      type: 'text',
      isRead: true
    },
    {
      id: "3",
      senderId: "1",
      content: "¿Estás bien? Vi tu ubicación",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text',
      isRead: false
    }
  ]

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatLastMessageTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m`
    } else if (diffHours < 24) {
      return `${diffHours}h`
    } else {
      return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
    }
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("Enviando mensaje:", messageText)
      setMessageText("")
    }
  }

  const handleVoiceCall = (contact: Contact) => {
    console.log("Iniciando llamada de voz con:", contact.name)
    alert(`Llamando a ${contact.name}...`)
  }

  const handleVideoCall = (contact: Contact) => {
    console.log("Iniciando videollamada con:", contact.name)
    alert(`Iniciando videollamada con ${contact.name}...`)
  }

  const handleShareLocation = () => {
    console.log("Compartiendo ubicación en tiempo real")
    alert("Ubicación compartida en tiempo real")
  }

  const handleTakePhoto = () => {
    console.log("Abriendo cámara")
    alert("Abriendo cámara para tomar foto")
  }

  const handleRecordAudio = () => {
    setIsRecording(!isRecording)
    console.log(isRecording ? "Deteniendo grabación" : "Iniciando grabación de audio")
  }

  if (selectedContact) {
    const contact = emergencyContacts.find(c => c.id === selectedContact)
    if (!contact) return null

    return (
      <div className="flex flex-col min-h-screen bg-white">
        {/* Header del chat */}
        <div className="bg-green-500 text-white p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedContact(null)}
            className="text-white hover:bg-green-600 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-10 w-10">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="font-medium">{contact.name}</h2>
            <p className="text-sm text-green-100">
              {contact.isOnline ? "En línea" : "Desconectado"}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVoiceCall(contact)}
              className="text-white hover:bg-green-600 p-2"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVideoCall(contact)}
              className="text-white hover:bg-green-600 p-2"
            >
              <Video className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.senderId === 'me'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === 'me' ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input de mensaje */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareLocation}
              className="border-green-200 text-green-600"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Ubicación
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTakePhoto}
              className="border-green-200 text-green-600"
            >
              <Camera className="h-4 w-4 mr-1" />
              Foto
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Escribe un mensaje..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 border-green-200 rounded-full"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecordAudio}
              className={`border-green-200 p-2 ${isRecording ? 'bg-red-100 text-red-600' : 'text-green-600'}`}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="bg-green-500 hover:bg-green-600 rounded-full p-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center mb-6">
            <Link href="/emergency" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Chat de Emergencia</h1>
          </div>

          {/* Botón para crear comunidad */}
          <div className="mb-6">
            <Button
              variant="outline"
              className="w-full border-green-200 text-green-600 rounded-xl py-4 flex items-center justify-center gap-2"
            >
              <Users className="h-5 w-5" />
              <span>Crear Comunidad Segura</span>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Lista de conversaciones */}
          <div className="space-y-3">
            <h2 className="font-medium text-green-800 mb-4">Contactos de Emergencia</h2>
            
            {emergencyContacts.map((contact) => (
              <Button
                key={contact.id}
                variant="ghost"
                onClick={() => setSelectedContact(contact.id)}
                className="w-full p-4 h-auto justify-start border border-green-200 rounded-xl hover:bg-green-50"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <Circle className="absolute -bottom-1 -right-1 h-4 w-4 fill-green-500 text-green-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-green-800">{contact.name}</span>
                      <span className="text-xs text-gray-500">
                        {formatLastMessageTime(contact.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{contact.relationship}</p>
                    <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                  </div>
                  
                  {contact.unreadCount > 0 && (
                    <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {contact.unreadCount}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>

          {/* Información adicional */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-medium text-blue-800 mb-2">Funciones disponibles</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Mensajes de texto en tiempo real</li>
              <li>• Compartir ubicación en vivo</li>
              <li>• Llamadas de voz y video</li>
              <li>• Envío de fotos y audio</li>
              <li>• Crear grupos de seguridad</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

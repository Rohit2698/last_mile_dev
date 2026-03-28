import React, { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDriverQuestions } from "./hook"
import { QuestionCard } from "./QuestionCard"
import { AddEditQuestionModal } from "./AddEditQuestionModal"
import { type Question } from "@/app/api/react-query/deliveryPartnerConfiguration"
import { ConfirmationModal } from "@/components/ConfirmationModal"

export const DriverQuestionsTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null,
  )

  const {
    tripStartQuestions,
    tripEndQuestions,
    pointOfDeliveryQuestions,
    handleDeleteQuestion,
    handleAddQuestion,
    handleUpdateQuestion,
  } = useDriverQuestions()

  const openAddQuestionModal = () => {
    setEditingQuestion(null)
    setIsModalOpen(true)
  }

  const openEditQuestionModal = (question: Question) => {
    setEditingQuestion(question)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingQuestion(null)
  }

  const openDeleteModal = (question: Question) => {
    setQuestionToDelete(question)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setQuestionToDelete(null)
  }

  const confirmDelete = async () => {
    if (questionToDelete && questionToDelete.id) {
      await handleDeleteQuestion(questionToDelete.id)
      closeDeleteModal()
    }
  }

  const handleSubmitNewQuestion = (
    questionData: Omit<Question, "id" | "order" | "createdAt" | "updatedAt">,
  ) => {
    handleAddQuestion(questionData)
  }

  const handleSubmitEditQuestion = (updatedQuestion: Question) => {
    if (editingQuestion) {
      // Pass the updated question data with the original question's metadata
      handleUpdateQuestion(updatedQuestion)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Driver Questions</h2>
        <Button onClick={openAddQuestionModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Trip Start Questions</CardTitle>
            <CardDescription>
              {tripStartQuestions.length} questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tripStartQuestions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                onEdit={openEditQuestionModal}
                onDelete={openDeleteModal}
              />
            ))}
            {tripStartQuestions.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No trip start questions configured
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trip End Questions</CardTitle>
            <CardDescription>
              {tripEndQuestions.length} questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tripEndQuestions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                onEdit={openEditQuestionModal}
                onDelete={openDeleteModal}
              />
            ))}
            {tripEndQuestions.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No trip end questions configured
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Point of Delivery Questions</CardTitle>
            <CardDescription>
              {pointOfDeliveryQuestions.length} questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pointOfDeliveryQuestions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                onEdit={openEditQuestionModal}
                onDelete={openDeleteModal}
              />
            ))}
            {pointOfDeliveryQuestions.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No point of delivery questions configured
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <AddEditQuestionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitNewQuestion}
        onUpdate={handleSubmitEditQuestion}
        editingQuestion={editingQuestion}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Question"
        description={
          questionToDelete
            ? `Are you sure you want to delete the question "${questionToDelete.text}"? This action cannot be undone.`
            : "Are you sure you want to delete this question?"
        }
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

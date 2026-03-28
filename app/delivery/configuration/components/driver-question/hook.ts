import { useState, useCallback, useMemo } from "react"
import {
  useQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  Question,
} from "@/app/api/react-query/deliveryPartnerConfiguration"

const defaultQuestion: Partial<Question> = {
  category: "trip_start",
  text: "",
  type: "yes_no",
  required: true,
  options: [],
}

export const useDriverQuestions = () => {
  // Question modal state
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [newQuestion, setNewQuestion] =
    useState<Partial<Question>>(defaultQuestion)

  // API hooks
  const { data: questionsData, isLoading, error } = useQuestions()
  const createMutation = useCreateQuestion()
  const updateMutation = useUpdateQuestion()
  const deleteMutation = useDeleteQuestion()

  const questions = useMemo(
    () => questionsData?.questions || [],
    [questionsData],
  )

  // Derived state
  const tripStartQuestions = useMemo(
    () =>
      questions
        ?.filter(q => q.category === "trip_start")
        .sort((a, b) => a.order - b.order),
    [questions],
  )

  const tripEndQuestions = useMemo(
    () =>
      questions
        ?.filter(q => q.category === "trip_end")
        .sort((a, b) => a.order - b.order),
    [questions],
  )

  const pointOfDeliveryQuestions = useMemo(
    () =>
      questions
        ?.filter(q => q.category === "point_of_delivery")
        .sort((a, b) => a.order - b.order),
    [questions],
  )

  // Question handlers
  const handleAddQuestion = useCallback(
    async (questionData: Partial<Question>) => {
      if (!questionData.text) {
        throw new Error("Question text is required")
      }

      const createData: CreateQuestionRequest = {
        category: questionData.category!,
        text: questionData.text,
        type: questionData.type!,
        options: questionData.options,
        required: questionData.required!,
      }
      await createMutation.mutateAsync(createData)
    },
    [createMutation],
  )

  const handleEditQuestion = useCallback((question: Question) => {
    console.log("debug:editqustinm")
    setEditingQuestion(question)
    setNewQuestion(question)
    setShowAddQuestion(true)
  }, [])

  const handleUpdateQuestion = useCallback(
    async (updatedQuestion: Question) => {
      if (!updatedQuestion.id) {
        throw new Error("Question ID is required for updates")
      }

      const updateData: UpdateQuestionRequest = {
        id: updatedQuestion.id,
        category: updatedQuestion.category,
        text: updatedQuestion.text,
        type: updatedQuestion.type,
        options: updatedQuestion.options,
        required: updatedQuestion.required,
      }
      console.log("debug:updatedQuestion", updateData)
      await updateMutation.mutateAsync(updateData)
    },
    [updateMutation],
  )

  const handleDeleteQuestion = useCallback(
    async (questionId: string) => {
      await deleteMutation.mutateAsync(questionId)
    },
    [deleteMutation],
  )

  // Question option handlers
  const addOption = useCallback(() => {
    setNewQuestion(prev => ({
      ...prev,
      options: [...(prev.options || []), ""],
    }))
  }, [])

  const updateOption = useCallback((index: number, value: string) => {
    setNewQuestion(prev => {
      const updatedOptions = [...(prev.options || [])]
      updatedOptions[index] = value
      return {
        ...prev,
        options: updatedOptions,
      }
    })
  }, [])

  const removeOption = useCallback((index: number) => {
    setNewQuestion(prev => ({
      ...prev,
      options: (prev.options || []).filter(
        (_: string, i: number) => i !== index,
      ),
    }))
  }, [])

  // Modal handlers
  const openAddQuestionModal = useCallback(() => {
    setEditingQuestion(null)
    setNewQuestion(defaultQuestion)
    setShowAddQuestion(true)
  }, [])

  const closeQuestionModal = useCallback(() => {
    setShowAddQuestion(false)
    setEditingQuestion(null)
    setNewQuestion(defaultQuestion)
  }, [])

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingQuestion) {
        // For updates, merge the editingQuestion with newQuestion to ensure all required fields are present
        const updatedQuestion: Question = {
          ...editingQuestion,
          ...newQuestion,
          id: editingQuestion.id!,
          category: newQuestion.category || editingQuestion.category,
          text: newQuestion.text || editingQuestion.text,
          type: newQuestion.type || editingQuestion.type,
          required:
            newQuestion.required !== undefined
              ? newQuestion.required
              : editingQuestion.required,
          order: editingQuestion.order,
          createdAt: editingQuestion.createdAt,
          updatedAt: new Date().toISOString(),
        }
        handleUpdateQuestion(updatedQuestion)
      } else {
        handleAddQuestion(newQuestion)
      }
      closeQuestionModal()
    } catch (error) {
      console.error("Error submitting question:", error)
    }
  }

  return {
    // State
    tripStartQuestions,
    tripEndQuestions,
    pointOfDeliveryQuestions,
    showAddQuestion,
    editingQuestion,
    newQuestion,
    isSaving:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    isLoading,
    error,

    // Setters
    setNewQuestion,

    // Handlers
    handleAddQuestion,
    handleEditQuestion,
    handleUpdateQuestion,
    handleDeleteQuestion,
    addOption,
    updateOption,
    removeOption,
    openAddQuestionModal,
    closeQuestionModal,
    handleSubmitQuestion,
  }
}

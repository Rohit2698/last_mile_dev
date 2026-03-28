/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { defaultQuestion } from "./util"
import { type Question } from "@/app/api/react-query/deliveryPartnerConfiguration"
import { FormSelect } from "@/components/fields/FormSelect"
import { FormInputField } from "@/components/fields"
import { SwitchField } from "@/components/fields/SwitchFields"
import { categoryOptions, typeOptions } from "@/lib/options"
import { Form } from "@/components/ui/form"

// Form validation schema
const questionFormSchema = z.object({
  category: z.enum(["trip_start", "trip_end", "point_of_delivery"]),
  text: z.string().min(1, "Question text is required"),
  type: z.enum(["yes_no", "text", "number", "select"]),
  options: z.array(z.string()).optional(),
  required: z.boolean(),
})

interface AddEditQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (
    question: Omit<Question, "id" | "order" | "createdAt" | "updatedAt">,
  ) => void
  onUpdate: (question: Question) => void
  editingQuestion?: Question | null
}

type QuestionFormData = Omit<
  Question,
  "id" | "order" | "createdAt" | "updatedAt"
>

export const AddEditQuestionModal: React.FC<AddEditQuestionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  editingQuestion,
}) => {
  const [localOptions, setLocalOptions] = useState<string[]>([])

  const isEditing = !!editingQuestion

  // Setup form with react-hook-form
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      category: defaultQuestion.category!,
      text: defaultQuestion.text!,
      type: defaultQuestion.type!,
      required: defaultQuestion.required!,
      options: defaultQuestion.options || [],
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = form

  // Watch the question type to show/hide options field
  const questionType = useWatch({
    control,
    name: "type",
  })

  // Reset form when modal opens/closes or editing question changes
  useEffect(() => {
    if (isOpen) {
      if (editingQuestion) {
        reset({
          category: editingQuestion.category,
          text: editingQuestion.text,
          type: editingQuestion.type,
          required: editingQuestion.required,
          options: editingQuestion.options || [],
        })
        setLocalOptions(editingQuestion.options || [])
      } else {
        reset({
          category: defaultQuestion.category!,
          text: defaultQuestion.text!,
          type: defaultQuestion.type!,
          required: defaultQuestion.required!,
          options: [],
        })
        setLocalOptions([])
      }
    }
  }, [isOpen, editingQuestion, reset])

  // Update form options when local options change
  useEffect(() => {
    setValue("options", localOptions)
  }, [localOptions, setValue])

  const addOption = () => {
    setLocalOptions(prev => [...prev, ""])
  }

  const updateOption = (index: number, value: string) => {
    setLocalOptions(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const removeOption = (index: number) => {
    setLocalOptions(prev => prev.filter((_, i) => i !== index))
  }

  const handleFormSubmit = (data: QuestionFormData) => {
    console.log("Form submitted:", data)
    // Filter out empty options
    const filteredOptions =
      data.options?.filter(option => option.trim() !== "") || []

    const questionData = {
      ...data,
      options: data.type === "select" ? filteredOptions : undefined,
    }

    if (isEditing && editingQuestion) {
      onUpdate({ ...editingQuestion, ...questionData })
    } else {
      onSubmit(questionData)
    }

    handleClose()
  }

  const handleClose = () => {
    reset()
    setLocalOptions([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-150 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Question" : "Add New Question"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the question details below."
              : "Configure a new question for drivers to answer."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormSelect
              name="category"
              control={control}
              label="Question Category"
              options={categoryOptions}
              placeholder="Select a category"
              description="Choose when this question should be asked"
              required
            />

            <FormInputField
              name="text"
              control={control}
              label="Question Text"
              placeholder="Enter the question..."
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
              The question that drivers will see and answer
            </p>

            <FormSelect
              name="type"
              control={control}
              label="Answer Type"
              options={typeOptions}
              placeholder="Select answer type"
              description="How drivers will provide their answer"
              required
            />

            {questionType === "select" && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Answer Options
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add the options that drivers can choose from
                </p>

                <div className="space-y-2">
                  {localOptions.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={e => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeOption(index)}
                        disabled={localOptions.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            )}

            <SwitchField
              name="required"
              control={control}
              label="Required Question"
              description="Drivers must answer this question to continue"
            />

            <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Adding..."
                  : isEditing
                    ? "Update Question"
                    : "Add Question"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

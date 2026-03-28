import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Question } from "@/app/api/react-query/deliveryPartnerConfiguration"

interface QuestionCardProps {
  question: Question
  onEdit: (question: Question) => void
  onDelete: (question: Question) => void
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    onDelete(question)
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium">{question.text}</p>
          <div className="flex items-center mt-2 space-x-2">
            <Badge
              variant={question.type === "yes_no" ? "default" : "secondary"}
            >
              {question.type.replace("_", " ")}
            </Badge>
            {question.required && <Badge variant="destructive">Required</Badge>}
          </div>
          {question.options && question.options.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Options:</p>
              <div className="flex flex-wrap gap-1">
                {question.options.map((option, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {option}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex space-x-1 ml-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(question)}
            title="Edit question"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            title="Delete question"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

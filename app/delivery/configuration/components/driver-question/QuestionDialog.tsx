import React from 'react';
import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Question } from '@/app/api/react-query/deliveryPartnerConfiguration';

type QuestionCategory = Question['category'];
type QuestionType = Question['type'];

interface QuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  question: Partial<Question>;
  editingQuestion: Question | null;
  onUpdateQuestion: (updates: Partial<Question>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onAddOption: () => void;
  onUpdateOption: (index: number, value: string) => void;
  onRemoveOption: (index: number) => void;
}

export const QuestionDialog: React.FC<QuestionDialogProps> = ({
  isOpen,
  onClose,
  question,
  editingQuestion,
  onUpdateQuestion,
  onSubmit,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingQuestion ? 'Edit Question' : 'Add New Question'}
          </DialogTitle>
          <DialogDescription>
            Configure a question that drivers will answer during their delivery process.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={question.category}
              onValueChange={(value) => onUpdateQuestion({ category: value as QuestionCategory })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trip_start">Trip Start</SelectItem>
                <SelectItem value="trip_end">Trip End</SelectItem>
                <SelectItem value="point_of_delivery">Point of Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-text">Question Text</Label>
            <Textarea
              id="question-text"
              value={question.text || ''}
              onChange={(e) => onUpdateQuestion({ text: e.target.value })}
              placeholder="Enter your question"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-type">Question Type</Label>
            <Select
              value={question.type}
              onValueChange={(value) => onUpdateQuestion({ type: value as QuestionType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes_no">Yes/No</SelectItem>
                <SelectItem value="text">Text Input</SelectItem>
                <SelectItem value="number">Number Input</SelectItem>
                <SelectItem value="select">Multiple Choice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {question.type === 'select' && (
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {(question.options || []).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => onUpdateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveOption(index)}
                      title="Remove option"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onAddOption}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={question.required || false}
              onCheckedChange={(checked) => onUpdateQuestion({ required: checked })}
            />
            <Label htmlFor="required">Required question</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingQuestion ? 'Update Question' : 'Add Question'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

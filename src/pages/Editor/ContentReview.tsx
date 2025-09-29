import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  ArrowLeft,
  Clock,
  Edit,
} from "lucide-react";

interface ContentReviewProps {
  onBack: () => void;
  onEdit: (storyTitle: string) => void;
  storyTitle: string;
}

export function ContentReview({
  onBack,
  onEdit,
  storyTitle,
}: ContentReviewProps) {
  const categories = [
    { name: "News", active: false },
    { name: "Politics", active: false },
    { name: "Sports", active: true },
    { name: "Entertainment", active: false },
    { name: "Technology", active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Back Button and Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Review Queue
            </Button>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Content Review
              </h2>
              <Button
                onClick={() => onEdit(storyTitle)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-sm border p-8 max-w-4xl">
            {/* Article Header */}
            <div className="border-b pb-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {storyTitle}
              </h1>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>March 15, 2024</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>5 min read</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>By Muthu</span>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-gray max-w-none space-y-6">
              <p className="text-lg text-gray-800 leading-relaxed">
                The city council has voted on a new housing development project
                that will shape the community for decades. The comprehensive
                housing plan addresses growing demand and aims to provide
                affordable housing options for residents at various income
                levels.
              </p>

              <p className="text-gray-700 leading-relaxed">
                After months of debate, the council reached a consensus on key
                provisions including zoning requirements and affordability
                guarantees. The city council unanimously voted in favor of
                advancing the plan with provisions for 200 affordable housing
                units set to be completed by the end of next year.
              </p>

              <p className="text-gray-700 leading-relaxed">
                Community leaders hailed the consensus as a major milestone,
                noting key provisions including zoning requirement changes and
                the downtown area. The city council unanimously voted in favor
                of advancing the plan with provisions for 200 affordable housing
                units set to be completed by the end of next year.
              </p>

              <p className="text-gray-700 leading-relaxed">
                After months of debate, the council reached a consensus on key
                provisions including zoning requirements and affordability
                guarantees. The city council unanimously voted in favor of
                advancing the plan with provisions for 200 affordable housing
                units set to be completed by the end of next year.
              </p>

              <p className="text-gray-700 leading-relaxed">
                Community leaders hailed the consensus as a major milestone,
                noting key provisions including zoning requirement changes that
                allow for increased density in the downtown area. The city
                council unanimously voted in favor of advancing the plan with
                provisions for 200 affordable housing units set to be completed
                by the end of next year.
              </p>

              <p className="text-gray-700 leading-relaxed">
                The city council has voted on a new housing development project
                that will shape the community for decades. The comprehensive
                housing plan addresses growing demand and aims to provide
                affordable housing options for residents at various income
                levels.
              </p>
            </div>

            {/* Categories/Tags */}
            <div className="mt-8 pt-6 border-t">
              <h4 className="font-medium text-gray-900 mb-3">Categories:</h4>
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((category, index) => (
                  <Badge
                    key={index}
                    variant={category.active ? "default" : "outline"}
                    className={`px-3 py-1 ${category.active
                        ? "bg-green-600 text-white"
                        : "text-gray-600 border-gray-300"
                      }`}
                  >
                    Tag {index + 1}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Reject
                </Button>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="text-green-700 border-green-200 hover:bg-green-50"
                  >
                    Request Story for print
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

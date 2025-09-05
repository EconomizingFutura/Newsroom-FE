import SharedCard from "@/components/shared/Card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RevertedArticleTypes } from "@/types/draftPageTypes";
import { getStatusColor, getTypeColor } from "@/utils/draftUtils";
import { AlertCircle, Edit, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatRelativeTime } from "@/utils/utils";

type GridViewProps = {
  filteredArticles: RevertedArticleTypes[];
  handleDeletePost: (id: string) => void;
  handleEdit: (id: string) => void;
  status: "Auto-saved" | "REVERTED" | "DRAFT";
};

type ListViewProps = {
  filteredArticles: RevertedArticleTypes[];
  handleEdit?: (id: string) => void;

};
export const RenderGridView: React.FC<GridViewProps> = ({
  filteredArticles,
  handleDeletePost,
  handleEdit, status
}) => (
  <div className="grid grid-cols-3 gap-6">
    {filteredArticles.map((article) => (
      <SharedCard
        id={article.id}
        key={article.id}
        title={article.title}
        updatedDate={article.updatedAt}
        wordCount={article.wordCount}
        savedTime={formatRelativeTime(article.updatedAt)}
        type={article.type}
        status={status}
        remarkMessage={article.remarks}
        contentPreview={article.title}
        handleDelete={() => handleDeletePost(article.id)}
        handleEdit={() => handleEdit(article.id)}
      />
    ))}
  </div>
);

export const RenderListView: React.FC<ListViewProps> = ({
  filteredArticles,
}) => (
  <div className="space-y-3">
    {filteredArticles.map((article) => (
      <Card
        key={article.id}
        className="p-4 bg-white border-red-200 hover:shadow-sm transition-shadow"
      >
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  {article.title}
                </h3>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={`text-xs ${getTypeColor(article.type)}`}>
                    {article.type}
                  </Badge>
                  <Badge className="text-xs bg-red-100 text-red-800">
                    {article.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Reverted {article.updatedAt} • {article.wordCount} words •
                    Editor: {article.editor}
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white gap-2 ml-4"
              // onClick={() => onEditReverted && onEditReverted(article)}
              >
                <Eye className="w-3 h-3" />
                View Details
              </Button>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="text-xs font-medium text-red-800 mb-1">
                Revision Required
              </div>
              <div className="text-xs text-red-700 leading-relaxed">
                {article.remarks}
              </div>
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export const RenderListViewDraft: React.FC<ListViewProps> = ({
  filteredArticles, handleEdit
}) => (
  <div className="space-y-3">
    {filteredArticles.map((article) => (
      <Card
        key={article.id}
        className="p-4 bg-white hover:shadow-sm transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {article.title}
              </h3>
              <div className="flex gap-2 flex-shrink-0">
                <Badge className={`text-xs ${getTypeColor(article.type)}`}>
                  {article.type}
                </Badge>
                <Badge
                  className={`text-xs ${getStatusColor(article.status)}`}
                >
                  {article.status}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Updated {formatDate(article.updatedAt)}</span>
              {article.wordCount > 0 && (
                <span>{article.wordCount} words</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
              onClick={() => handleEdit?.(article.id)}
            >
              <Edit className="w-3 h-3" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 w-8 h-8 p-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

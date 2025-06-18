import { CustomFieldTagRenderer } from "@/components/CustomFieldTagRenderer";
import { LabelBadge } from "@/components/Label/LabelBadge";
import StackedAvatars from "@/components/StackedAvatars";

interface Props {
  item: ITaskWithOptions;
  projectName: string;
  index: number;
}

export const TaskItem = ({ item, projectName }: Props) => {
  return (
    <>
      <div className="bg-white dark:bg-gray-900 px-4 py-3 mx-2 rounded-md border border-gray-300 dark:border-gray-700 text-sm cursor-grab">
        <div className="flex justify-between">
          <span className="text-[11px] text-gray-400 dark:text-gray-400">
            {projectName}
          </span>
          <StackedAvatars users={(item.assignees as Partial<IUser>[]) || []} />
        </div>
        <div className="my-2 cursor-pointer hover:underline w-fit">
          <p>{item.title}</p>
        </div>
        <div className="space-x-2">
          {item.priority && (
            <CustomFieldTagRenderer
              color={item.priority.color}
              label={item.priority.label}
            />
          )}
          {item.size && (
            <CustomFieldTagRenderer
              color={item.size.color}
              label={item.size.label}
            />
          )}
          {item.labels?.map((label) => (
            <LabelBadge
              key={label.id}
              color={label.color}
              labelText={label.label}
            />
          ))}
        </div>
      </div>
    </>
  );
};

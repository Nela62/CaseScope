import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DisplayTaskStatus = ({ taskId }: { taskId: string }) => {
  return <div>TaskStatus for {taskId}</div>;
};

export const DisplayFileProcessingStatus = ({
  taskIds,
}: {
  taskIds: string[];
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Extracting Data</CardTitle>
      </CardHeader>
      <CardContent>
        {taskIds.map((taskId) => (
          <DisplayTaskStatus key={taskId} taskId={taskId} />
        ))}
        <Link href="/case-library">
          <Button>Back to Case Library</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

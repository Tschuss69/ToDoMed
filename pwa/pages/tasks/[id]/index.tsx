import {
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import { useRouter } from "next/router";
import {useMutation, useQuery} from "react-query";

import { Task } from "@/types/Task";
import {FetchError, FetchResponse} from "@/utils/dataAccess";
import { useMercure } from "@/utils/mercure";
import VideoTask from "@/components/task/VideoTask";
import {useEffect, useState} from "react";
import {getTask, saveTask} from "@/api/task/fetch";


const Page: NextComponentType<NextPageContext> = () => {

  const router = useRouter();
  const { id } = router.query;

  const saveMutation = useMutation<
      FetchResponse<Task> | undefined,
      Error | FetchError,
      SaveParams
      >((saveParams) => saveTask(saveParams));

  const { data: { data: task, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Task> | undefined>(["task", id], () => getTask(id));
  const taskData = useMercure(task, hubURL);

  const [taskCompleted, setTaskCompleted] = useState<boolean>();

  useEffect(() => {
    if(taskData && taskData.status === 'completed'){
      setTaskCompleted(true)
    }else{
      setTaskCompleted(false)
    }
  }, [taskData])


  const updateTask = (inTaskCompleted) => {
    const status = inTaskCompleted ? "completed" : "requested";

    const newValues = {...task, status: status};

    saveMutation.mutate(
        newValues,
        {
          onError: (error) => {
            if(newValues.status === "completed" && taskCompleted){
              setTaskCompleted(false);
            }else if (newValues.status !== "completed" && !taskCompleted){
              setTaskCompleted(true);
            }
          },
        }
    )
  }

  useEffect(() => {
    if(taskCompleted &&  task?.status !== "completed"){
      updateTask(taskCompleted);
    }

    if(!taskCompleted && task?.status === "completed"){
      updateTask(taskCompleted);
    }
  }, [taskCompleted])

  if (!taskData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  const changeTask = () => {
    setTaskCompleted(!taskCompleted)
  }

  return (
    <VideoTask task={task} taskCompleted={taskCompleted} onTaskCheck={changeTask}/>
  );
};



export default Page;

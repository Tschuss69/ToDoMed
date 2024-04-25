import {LocalVideo} from "@/components/general/video/LocalVideo";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import LayoutTask from "@/pages/tasks/video/Layout";
import {Task} from "@/types/Task";
import {Checkbox} from "@/components/ui/checkbox";


export default function VideoTask({taskCompleted, task, onTaskCheck}: {task: Task}){

    return(
        <LayoutTask>
            <Card>
                <CardHeader>
                    <CardTitle className={'pb-2'}>{task.title}</CardTitle>
                    <CardDescription>{task.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <LocalVideo url={'/videos/video.mp4'} width={350} height={350}/>
                    <br/>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="done"
                            checked={taskCompleted}
                            onCheckedChange={() => onTaskCheck()}
                        />
                        <label
                            htmlFor="done"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Je certifie avoir vu et compris la video
                        </label>
                    </div>
                </CardContent>
            </Card>
        </LayoutTask>
    );
}

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function TalentForecastLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[500px] mt-2" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-4 w-[350px] mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-5 w-10" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-5 w-10" />
              </div>
            </div>
            <div className="col-span-3">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-4 w-[350px] mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-4 w-[350px] mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-[80%] mt-1" />
            </div>
            <div>
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-[80%] mt-1" />
            </div>
            <div>
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-[80%] mt-1" />
            </div>
            <div>
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-[80%] mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

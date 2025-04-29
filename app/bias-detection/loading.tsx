import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function BiasDetectionLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-[450px]" />
        <Skeleton className="h-4 w-[350px] mt-2" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-10 w-[300px]" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px] mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[250px] mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[50px]" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-5 w-[50px]" />
              </div>
              <Skeleton className="h-3 w-full mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px] mt-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

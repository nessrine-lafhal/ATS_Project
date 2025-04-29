import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-[50%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-10 w-[250px]" />

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[40%]" />
              <Skeleton className="h-4 w-[60%]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-10 w-[200px]" />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-[40%]" />
                <Skeleton className="h-4 w-[60%]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-[30%]" />
                    <Skeleton className="h-8 w-[20%]" />
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-[40%]" />
                          <Skeleton className="h-4 w-[10%]" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-[40%]" />
                <Skeleton className="h-4 w-[60%]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-[40%]" />
                        <Skeleton className="h-4 w-[10%]" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

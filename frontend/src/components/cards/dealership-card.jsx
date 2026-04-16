import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, MapPin, Star, Car } from "lucide-react";
import { formatPrice } from "@/lib/mock-data";
function DealershipCard({ dealership }) {
  const progress = dealership.currentBuyers / dealership.requiredBuyers * 100;
  const lowestPrice = Math.min(...dealership.models.map((m) => m.price));
  const highestDiscount = Math.max(...dealership.models.map((m) => m.discountPercentage));
  return <Link href={`/dealerships/${dealership.id}`}>
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={dealership.image || "/placeholder.svg"}
          alt={dealership.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge className="bg-primary text-primary-foreground">
            Up to {highestDiscount}% OFF
          </Badge>
          {dealership.featured && <Badge variant="secondary">Featured</Badge>}
        </div>
        <div className="absolute bottom-3 right-3">
          <Badge variant="outline" className="border-background/20 bg-background/80 text-foreground backdrop-blur">
            <Clock className="mr-1 h-3 w-3" />
            {dealership.daysRemaining} days left
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-1 text-balance">{dealership.name}</h3>
          <Badge variant="outline" className="shrink-0">
            {dealership.brand}
          </Badge>
        </div>
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1">{dealership.location}</span>
        </div>
        <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {dealership.rating} ({dealership.reviewCount})
          </span>
          <span className="flex items-center gap-1">
            <Car className="h-3 w-3" />
            {dealership.models.length} models
          </span>
        </div>
        <div className="mb-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              {dealership.currentBuyers}/{dealership.requiredBuyers} buyers
            </span>
            <span className="font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Starting from</p>
            <p className="text-lg font-bold text-foreground">{formatPrice(lowestPrice)}</p>
          </div>
          <p className="text-sm font-medium text-primary">
            Avg. {dealership.averageDiscount}% off
          </p>
        </div>
      </CardContent>
    </Card>
  </Link>;
}
export {
  DealershipCard
};

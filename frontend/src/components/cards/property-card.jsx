import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Bed, Bath, Square, Clock, Users } from "lucide-react";
import { formatPrice } from "@/lib/mock-data";
function PropertyCard({ property }) {
  const progress = property.currentBuyers / property.requiredBuyers * 100;
  return <Link href={`/properties/${property.id}`}>
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge className="bg-primary text-primary-foreground">
            {property.discountPercentage}% OFF
          </Badge>
          {property.featured && <Badge variant="secondary">Featured</Badge>}
        </div>
        <div className="absolute bottom-3 right-3">
          <Badge variant="outline" className="border-background/20 bg-background/80 text-foreground backdrop-blur">
            <Clock className="mr-1 h-3 w-3" />
            {property.daysRemaining} days left
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-1 text-balance">{property.title}</h3>
          <Badge variant="outline" className="shrink-0 capitalize">
            {property.type}
          </Badge>
        </div>
        <p className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {property.location}
        </p>
        <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Bed className="h-3 w-3" />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3 w-3" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Square className="h-3 w-3" />
            {property.area} sqft
          </span>
        </div>
        <div className="mb-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              {property.currentBuyers}/{property.requiredBuyers} buyers
            </span>
            <span className="font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-lg font-bold text-foreground">{formatPrice(property.price)}</p>
            <p className="text-sm text-muted-foreground line-through">
              {formatPrice(property.originalPrice)}
            </p>
          </div>
          <p className="text-sm font-medium text-primary">
            Save {formatPrice(property.originalPrice - property.price)}
          </p>
        </div>
      </CardContent>
    </Card>
  </Link>;
}
export {
  PropertyCard
};

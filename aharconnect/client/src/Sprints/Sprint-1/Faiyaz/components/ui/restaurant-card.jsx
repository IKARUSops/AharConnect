import React from "react";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import Button from '../../components/ui/button';
import { Link } from "react-router-dom";

export function RestaurantCard({ restaurant }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop'}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
        />
      </div>
      <CardContent className="flex-grow p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{restaurant.name}</h3>
          {restaurant.rating && (
            <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-yellow-800 text-sm">
              <span className="mr-1">★</span>
              {restaurant.rating.toFixed(1)}
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{restaurant.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {restaurant.cuisineType.map((cuisine, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-ahar-soft-purple text-ahar-tertiary text-xs rounded-full"
            >
              {cuisine}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">{restaurant.priceRange}</div>
          {restaurant.openingHours && (
            <div className="text-muted-foreground">
              {restaurant.openingHours.opening} - {restaurant.openingHours.closing}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/restaurants/${restaurant.id}`}>View Menu</Link>
        </Button>
        <Button asChild className="flex-1 bg-[#B48CF0] hover:bg-[#9B6FE0] text-white font-medium shadow-sm hover:shadow-md transition-all">
          <Link to={`/restaurants/${restaurant.id}/reserve`} className="text-white">Reserve</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

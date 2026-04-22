interface props {
  name: string;
  des: string;
  image: string;
  price: number;
}

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button, buttonVariants } from "./ui/button";

const ViewCard = ({ name, des, image, price }: props) => {
  return (
    <div>
      <Card className="w-full max-w-sm">
        <CardContent className="">
          <img
            className="w-full object-cover rounded-md aspect-auto"
            src={image}
            alt={name}
          />
          <p className="text-xl">{name}</p>
          <p>{des}</p>
          <p className="text-green-500">{price}</p>
        </CardContent>
        <CardFooter>
          <Button>View More</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default ViewCard;

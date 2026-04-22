interface Props {
  name: string;
  price: number;
  description: string;
  image: string;
}

const ProductCard = ({ name, price, description, image }: Props) => {
  return (
    <div>
      <div className="border rounded-xl shadow-sm p-4 hover:shadow-lg transition">
        <img
          src={image}
          alt={name}
          className="w-full aspect-2/3 object-cover rounded-md"
        />
        <h2 className="text-lg font-semibold mt-3">{name}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
        <p className="text-blue-500 font-bold mt-2">${price}</p>
      </div>
    </div>
  );
};
export default ProductCard;

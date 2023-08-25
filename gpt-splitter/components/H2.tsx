import clsx from "clsx";

const H2 = ({ className, ...props }) => {
  return (
    <h2
      className={clsx("text-2xl font-bold text-white", className)}
      {...props}
    />
  );
};

export default H2;

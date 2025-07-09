import Button from "@/design-system/Button";
import Loading from "@/design-system/Loading";
import classNames from "classnames";
import { Childrenable } from "../types";

function Container({ children }: Childrenable) {
  return <div className="flex flex-col gap-4 w-[56rem]">{children}</div>;
}

function Group({ children }: Childrenable) {
  return <div className="rounded-md overflow-hidden">{children}</div>;
}

interface SectionTitleProps {
  title: string;
}

function Title({ title }: SectionTitleProps) {
  return (
    <span className="text-light-onSurface text-title-medium">{title}</span>
  );
}

interface HeaderProps {
  title: string;
}

function Header({ title }: HeaderProps) {
  return (
    <div className="bg-light-tertiaryContainer p-4">
      <span className="text-body-large text-light-onTertiaryContainer">
        {title}
      </span>
    </div>
  );
}

interface SectionRowProps {
  label: string;
  value?: string;
  onEdit: () => void;
  isLoading?: boolean;
}

function Row({ label, value, onEdit, isLoading = false }: SectionRowProps) {
  return (
    <div className="bg-light-surfaceContainerLowest p-4 border-b flex last:border-none">
      <div className="w-full flex items-center">
        <span className="text-light-onSurface flex-1 text-body-large">
          {label}
        </span>
        {value && (
          <Loading
            className="flex-1 text-light-onSurface text-body-large line-clamp-1"
            isLoading={isLoading}
          >
            {value}
          </Loading>
        )}
      </div>
      <Button
        variant="quaternary"
        onClick={onEdit}
        state={isLoading ? "loading" : undefined}
        iconLeft="Edit"
      />
    </div>
  );
}

interface SectionBodyProps extends Childrenable {
  className?: string;
}

function Body({ children, className }: SectionBodyProps) {
  return (
    <div
      className={classNames(
        "bg-light-surfaceContainerLowest p-4 grid grid-cols-2 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

const Section = Object.assign(Container, { Title, Group, Header, Row, Body });

export default Section;

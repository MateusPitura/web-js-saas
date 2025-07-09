import classNames from "classnames";
import { Children, type ReactElement, type ReactNode } from "react";
import Button from "./Button";
import Spinner from "@/design-system/Spinner";
import { Popover } from "./Popover";
import SideSheet from "./SideSheet";
import { Childrenable } from "@/domains/global/types";
import useDialog from "@/domains/global/hooks/useDialog";
import Loading from "./Loading";
import useCheckPermission from "@/domains/global/hooks/useCheckPermission";
import { formatDeniedMessage } from "@shared/utils/formatDeniedMessage";
import { Resource, Action as ActionProp } from "@shared/types";
import { ButtonState } from "./types";
import { ITEMS_PER_PAGE } from "@shared/constants";

function Container({ children }: Childrenable): ReactElement {
  return (
    <div className="overflow-x-auto flex flex-1">
      <div className="min-w-[50rem] w-full flex flex-col">{children}</div>
    </div>
  );
}

interface RowProps extends Childrenable {
  className?: string;
  gridColumns?: number | "auto" | "default";
}

function Row({ children, className, gridColumns = "default" }: RowProps) {
  let gridColumnsCount = gridColumns;
  if (gridColumns === "default") {
    gridColumnsCount = 10;
  } else if (gridColumns === "auto") {
    gridColumnsCount = (Children.count(children) - 2) * 2 + 2;
  }

  return (
    <div
      className={classNames(
        "p-4 grid gap-2 bg-light-surfaceContainerLowest h-[72px] items-center border-b border-outlineVariant",
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${gridColumnsCount}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

type HeaderProps = RowProps;

function Header({ children, className, gridColumns }: HeaderProps) {
  return (
    <Row
      className={classNames(
        "bg-light-tertiaryContainer rounded-t-md border-none",
        className
      )}
      gridColumns={gridColumns}
    >
      {children}
    </Row>
  );
}

interface CellProps {
  className?: string;
  colSpan?: number;
  label?: string;
}

function Cell({ label, className, colSpan }: CellProps) {
  const colSpanAux = colSpan ?? 2;

  return (
    <span
      className={classNames(
        "text-light-onTertiaryContainer text-body-medium overflow-x-hidden",
        className,
        {
          "first:!col-span-1": !colSpan,
        }
      )}
      style={{
        gridColumn: `span ${colSpanAux} / span ${colSpanAux}`,
      }}
    >
      {label}
    </span>
  );
}

interface ActionProps extends Childrenable {
  className?: string;
  colSpan?: number;
}

function Action({ className, colSpan = 1, children }: ActionProps) {
  return (
    <div
      className={classNames("overflow-x-hidden flex justify-end", className)}
      style={{
        gridColumn: `span ${colSpan} / span ${colSpan}`,
      }}
    >
      <Popover>
        <Popover.Trigger>
          <Button variant="tertiary" iconRight="MoreHoriz" />
        </Popover.Trigger>
        <Popover.Content align="end" className="w-fit">
          {children}
        </Popover.Content>
      </Popover>
    </div>
  );
}

interface HeadProps extends CellProps {
  action?: boolean;
}

function Head({ label, className, action = false, colSpan }: HeadProps) {
  return (
    <Cell
      className={classNames("!text-body-large", className, {
        "!col-span-1": action,
      })}
      label={label}
      colSpan={colSpan}
    />
  );
}

interface BodyProps extends Childrenable {
  isEmpty?: boolean;
  isLoading?: boolean;
  resource?: Resource;
  action?: ActionProp;
}

function Body({ children, isEmpty, isLoading, action, resource }: BodyProps) {
  const hasPermission = useCheckPermission(resource, action);

  if (isLoading || isEmpty) {
    return (
      <div className="flex-1 bg-light-surfaceContainerLowest overflow-y-auto flex items-center justify-center">
        {isLoading ? (
          <Spinner />
        ) : (
          <span className="text-light-onSurface text-body-medium">
            {hasPermission
              ? "Nenhum item encontrado"
              : formatDeniedMessage({ resource, action })}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-light-surfaceContainerLowest overflow-y-auto">
      {children}
    </div>
  );
}

interface FooterProps {
  className?: string;
  onClickSheetBtn?: () => void;
  sheetBtnState?: ButtonState;
  onClickPdfBtn?: () => void;
  pdfBtnState?: ButtonState;
  onClickNavigateBtn?: (page: number) => void;
  currentStartItem?: number;
  totalItems?: number;
  itemsPerPage?: number;
  isLoading?: boolean;
  resourceExportBtn?: Resource;
  actionExportBtn?: ActionProp;
}

function Footer({
  className,
  currentStartItem = 1,
  itemsPerPage = ITEMS_PER_PAGE,
  totalItems,
  onClickPdfBtn,
  onClickSheetBtn,
  onClickNavigateBtn,
  isLoading,
  pdfBtnState,
  sheetBtnState,
  actionExportBtn,
  resourceExportBtn,
}: FooterProps) {
  const pageOffset = (currentStartItem - 1) * itemsPerPage; // 0, 20, 40 etc.

  const lastPage = totalItems && totalItems <= pageOffset + itemsPerPage; // 21-30 of 30 or 21-40 of 40

  function handleNext() {
    if (onClickNavigateBtn) {
      onClickNavigateBtn(lastPage ? currentStartItem : currentStartItem + 1); // Don't allow to navigate to next page if it's the last one
    }
  }

  function handleBefore() {
    if (onClickNavigateBtn) {
      onClickNavigateBtn(currentStartItem === 1 ? 1 : currentStartItem - 1); // Don't allow to navigate to previous page if it's the first one
    }
  }

  return (
    <Row
      className={classNames(
        "bg-light-tertiaryContainer rounded-b-md border-none !flex items-center gap-4 justify-end",
        className
      )}
      gridColumns={1}
    >
      {onClickSheetBtn && (
        <Button
          variant="quaternary"
          label="Exportar como planilha"
          iconRight="FileDownload"
          onClick={onClickSheetBtn}
          state={isLoading ? "loading" : sheetBtnState}
          resource={resourceExportBtn}
          action={actionExportBtn}
        />
      )}
      {onClickPdfBtn && (
        <Button
          variant="quaternary"
          label="Exportar como PDF"
          iconRight="FileDownload"
          onClick={onClickPdfBtn}
          state={isLoading ? "loading" : pdfBtnState}
          resource={resourceExportBtn}
          action={actionExportBtn}
        />
      )}
      <Loading
        isLoading={!!isLoading}
        className="text-light-onTertiaryContainer text-body-large"
      >
        {totalItems && (
          <>
            {`${pageOffset + 1}`}
            {`-${lastPage ? totalItems : pageOffset + itemsPerPage}`}
            {` de ${totalItems}`}
          </>
        )}
      </Loading>
      <Button
        variant="tertiary"
        iconLeft="NavigateBefore"
        onClick={handleBefore}
        state={
          isLoading
            ? "loading"
            : currentStartItem === 1
            ? "disabled"
            : undefined
        }
      />
      <Button
        variant="tertiary"
        iconLeft="NavigateNext"
        onClick={handleNext}
        state={
          isLoading
            ? "loading"
            : lastPage || !totalItems
            ? "disabled"
            : undefined
        }
      />
    </Row>
  );
}

interface FilterProps {
  onFilterCallback?: () => void;
  filterBtnState?: ButtonState;
  form: ReactNode;
}

function Filter({ onFilterCallback, filterBtnState, form }: FilterProps) {
  const dialog = useDialog();

  return (
    <SideSheet {...dialog}>
      <SideSheet.Trigger>
        <div className="flex justify-end">
          <Button
            variant="secondary"
            label="Filtros"
            iconRight="FilterList"
            onClick={onFilterCallback}
            state={filterBtnState}
          />
        </div>
      </SideSheet.Trigger>
      <SideSheet.Content>
        <SideSheet.Header label="Filtros" />
        {form}
      </SideSheet.Content>
    </SideSheet>
  );
}

const Table = Object.assign(Container, {
  Row,
  Cell,
  Header,
  Head,
  Body,
  Footer,
  Filter,
  Action,
});

export default Table;

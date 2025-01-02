import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";

import { useMemo, useState } from "react";

// const tableTheme = themeQuartz.withPart(iconSetQuartzLight).withParams({
//   backgroundColor: "#ffffff",
//   browserColorScheme: "light",
//   columnBorder: false,
//   fontFamily: "Arial",
//   foregroundColor: "rgb(46, 55, 66)",
//   headerBackgroundColor: "#F9FAFB",
//   headerFontSize: 14,
//   headerFontWeight: 600,
//   headerTextColor: "#919191",
//   oddRowBackgroundColor: "#F9FAFB",
//   rowBorder: false,
//   sidePanelBorder: false,
//   spacing: 8,
//   wrapperBorder: false,
//   wrapperBorderRadius: 0,
// });

// TODO: Low: Register only the required modules
// TODO: Low: Enable Server side pagination, sorting, filtering
ModuleRegistry.registerModules([AllCommunityModule]);

// TODO: Improve displayed data, including true/false values, money, arrays
// TODO: High: Add sorting, filtering

const paginationPageSizeSelector = [5, 10, 20, 30, 40, 50];

export const AGTable = ({
  data,
  columns,
}: {
  data: Record<string, unknown>[];
  columns: ColDef[];
}) => {
  const [rowData] = useState(data);
  const [colDefs] = useState(columns);

  const defaultColDef = useMemo(
    () => ({
      wrapText: true,
      autoHeight: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    }),
    []
  );

  return (
    <div className="h-full">
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination
        paginationPageSize={10}
        paginationPageSizeSelector={paginationPageSizeSelector}
      />
    </div>
  );
};

import React, { Fragment, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  useTable,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  useGlobalFilter
} from "react-table";


const TableContainer = ({ columns, data, renderRowSubComponent, filter }) => {
  const navigate = useNavigate();
  // const [tableFiltered, setTableFiltered] = useState()

  const ourGlobalFilterFunction = useCallback(
    (rows, ids, query) => {
      if (Object.keys(filter).length === 0) {
        return rows
      }
      if (query.creationTimestamp1 && query.creationTimestamp2) {
        return rows.filter(itemRow => {
          let flag = false;
          Object.keys(itemRow.values).forEach(itemKeys => {
            console.log("itemKey", itemKeys)
            if (itemRow.values.creationTimestamp >= query.creationTimestamp1 && itemRow.values.creationTimestamp <= query.creationTimestamp2) {
              flag = true;

            }


          })
          return flag;
        })
      }
      return rows.filter(itemRow => {
        let flag = false;
        Object.keys(itemRow.values).forEach(itemKeys => {
          if (String(itemRow.values[itemKeys])?.includes(query[itemKeys])) {
            flag = true;
          }

        })
        return flag;
      })

    },
    [filter]
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      globalFilter: ourGlobalFilterFunction,
      data,
      // defaultColumn: { Filter: DefaultColumnFilter },
      initialState: { pageIndex: 0, pageSize: 10 },
      // filtered: tableFiltered,
      // onFilteredChange: filtered => setTableFiltered(filtered)
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );
  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };

  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };
  const handleSearch = () => {
    setGlobalFilter(filter); // Set the Global Filter to the filter prop.
    Object.entries(filter).map(([key, value]) =>
      navigate(`?${key}=${value}`)
    )
  };
  return (
    <Fragment>
      <button className="searchbtn" onClick={handleSearch}>Search</button>

      {/* <div style={{ padding: "20px" }}>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th style={{ padding: "10px" }} {...column.getHeaderProps()}>
                <Filter column={column} />
              </th>
            ))}
          </tr>
        ))}
      </div> */}
      <table className="table table-hover" {...getTableProps()}>

        <thead>

          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  <div {...column.getSortByToggleProps()}>
                    {column.render("Header")}
                    {generateSortingIndicator(column)}
                  </div>
                  {/* <Filter column={column} /> */}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <Fragment key={row.getRowProps().key}>
                <tr>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
                {row.isExpanded && (
                  <tr>
                    <td colSpan={visibleColumns.length}>
                      {renderRowSubComponent(row)}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>

      <div>
        {/* <Pagination  itemsPerPage={4}/> */}
      </div>
      <div
        className="row"
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          justifyContent: "space-between",
          padding: "20px"
        }}
      >
        <div className="col" md={3}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"First"}
          </button>
          &nbsp;
          <button
            type="button"
            className="btn btn-primary"
            onClick={previousPage}
            disabled={!canPreviousPage}
          >
            {"Previous"}
          </button>
        </div>
        <div className="col" md={2} style={{ marginTop: 7 }}>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </div>
        <div className="col" md={2}>
          <input
            type="number"
            min={1}
            style={{ width: 70 }}
            max={pageOptions.length}
            defaultValue={pageIndex + 1}
            onChange={onChangeInInput}
          ></input>
        </div>
        <div className="col" md={2}>
          <select
            id="custom-select"
            value={pageSize}
            onChange={onChangeInSelect}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="col" md={3}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={nextPage}
            disabled={!canNextPage}
          >
            {"Next"}
          </button>
          &nbsp;
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {"Last"}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default TableContainer;

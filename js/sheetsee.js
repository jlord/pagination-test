function exportFunctions(exports) {

// // // // // // // // // // // // // // // // // // // // // // // //  // //
//
// // // Make Table, Sort and Filter Interactions
//
// // // // // // // // // // // // // // // // // // // // // // // //  // //

// Delete isn't working in search

function initiateTableFilter(opts) {
  // console.log("Orig Data is", opts.data.length)
  // var origData = opts.data
  console.log("optsfilterdiv", opts.filterDiv)
  injectFilterHTML(opts.filterDiv)
  $('.clear').on("click", function() {
    $(this.id + ".noMatches").css("visibility", "hidden")
    $(this.id + opts.filterDiv).val("")
    // opts.data = origData
    makeTable(opts)
  })
  $(opts.filterDiv).keyup(function(e) {
    var text = $(e.target).val()
    console.log(opts.data.length, text)
    searchTable(opts, text)
  })
}

function injectFilterHTML(filterDiv) {
  console.log(filterDiv)
  $("<span class='clear button'>Clear</span>" +
  "<span class='noMatches'>no matches</span>").insertAfter(filterDiv)
}

function searchTable(opts, searchTerm) {
  // console.log("searching", opts.data.length)
  var filteredList = []
  opts.data.forEach(function(object) {
    var stringObject = JSON.stringify(object).toLowerCase()
    if (stringObject.match(searchTerm.toLowerCase())) filteredList.push(object)
  })
  if (filteredList.length === 0) {
    $(".noMatches").css("visibility", "inherit")
    makeTable(opts, filteredList)
  }
  else {
    $(".noMatches").css("visibility", "hidden")
    makeTable(opts, filteredList)
  }
}

function sortThings(opts, sorter, sorted) {
  console.log("here is data", opts.data)
  opts.data.sort(function(a,b){
    if (a[sorter]<b[sorter]) return -1
    if (a[sorter]>b[sorter]) return 1
    return 0
  })
  if (sorted === "descending") opts.data.reverse()
  makeTable(opts)
  var header
  $(opts.tableDiv + " .tHeader").each(function(i, el){
    var contents = resolveDataTitle($(el).text())
    if (contents === sorter) header = el
  })
  $(header).attr("data-sorted", sorted)
}

function resolveDataTitle(string) {
  var adjusted = string.toLowerCase().replace(/\s/g, '').replace(/\W/g, '')
  return adjusted
}

function initiateTableSorter(options) {
  var sortInfo = $(document).on("click", ".tHeader", sendToSort)

  function sendToSort(event) {
    var tableDiv = "#" + $(event.target).closest("div").attr("id")
    console.log("came from this table",tableDiv)
    var sorted = $(event.target).attr("data-sorted")
    if (sorted) {
      if (sorted === "descending") sorted = "ascending"
      else sorted = "descending"
    }
    else { sorted = "ascending" }
    var sorter = resolveDataTitle(event.target.innerHTML)
    var sortInfo = {"sorter": sorter, "sorted": sorted, "tableDiv": tableDiv}
    console.log(sortInfo)
    sortThings(options, sorter, sorted, tableDiv)
  }
}

function makeTable(opts, filteredList) {
  if (filteredList) var data = filteredList
    else var data = opts.data

  if (!opts.pagination) table(data, targetDiv)
  var allRows = data.length
  var totalPages = Math.floor(allRows / opts.pagination)
  var currentPage = 1
  var currentStart = (currentPage * opts.pagination) - opts.pagination
  var currentEnd = currentPage * opts.pagination
  var currentRows = data.slice(currentStart, currentEnd)
  table(currentRows, opts.tableDiv)
  if (opts.data.length > opts.pagination) setPreNext(opts.tableDiv, currentPage, currentPage, totalPages)

  $(document).on("click", (".pagination-next"), function() {
    // if (opts.filterDiv && $(opts.filterDiv).val().length === 0 ) console.log("unempty filter!")
    currentPage = currentPage + 1
    var nextPage = currentPage + 1
    currentStart = (currentPage * opts.pagination) - opts.pagination
    currentEnd = currentPage * opts.pagination
    currentRows = data.slice(currentStart, currentEnd)
    table(currentRows, opts.tableDiv)
    setPreNext(opts.tableDiv, currentPage, currentPage, totalPages)
  })

  $(document).on("click", (".pagination-pre"), function() {
    currentPage = currentPage - 1
    var nextPage = currentPage + 1
    currentStart = (currentPage * opts.pagination) - opts.pagination
    currentEnd = currentPage * opts.pagination
    currentRows = data.slice(currentStart, currentEnd)
    table(currentRows, opts.tableDiv)
    setPreNext(opts.tableDiv, currentPage, currentPage, totalPages)
  })
}

function setPreNext(targetDiv, currentPage, currentPage, totalPages) {
  $(targetDiv).append("<div id='Pagination' pageno='" + currentPage + "'" + "class='table-pagination'>Showing page "
    + currentPage + " of " + totalPages + " <a class='pagination-pre'>Previous</a>" +
    " <a class='pagination-next'>Next</a></p></div>" )
}

function clearPreNExt() {
  $(".table-pagination").attr("display", "none")
}

function table(data, targetDiv) {
  var templateID = targetDiv.replace("#", "")
  var tableContents = ich[templateID]({
    rows: data
  })
  $(targetDiv).html(tableContents)
}

// tables
exports.searchTable = searchTable
exports.initiateTableFilter = initiateTableFilter
exports.makeTable = makeTable
// exports.sendToSort = sendToSort
exports.resolveDataTitle = resolveDataTitle
exports.sortThings = sortThings
exports.initiateTableSorter = initiateTableSorter
}
var Sheetsee = {}
exportFunctions(Sheetsee)

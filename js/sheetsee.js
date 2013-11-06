function exportFunctions(exports) {

// // // // // // // // // // // // // // // // // // // // // // // //  // //
//
// // // Make Table, Sort and Filter Interactions
//
// // // // // // // // // // // // // // // // // // // // // // // //  // //

function initiateTableFilter(data, filterDiv, tableDiv) {
  $('.clear').on("click", function() { 
    $(this.id + ".noMatches").css("visibility", "hidden")
    $(this.id + filterDiv).val("")
    makeTable(data, tableDiv)
  })
  $(filterDiv).keyup(function(e) {
    var text = $(e.target).val()
    searchTable(data, text, tableDiv)
  })
}

function searchTable(data, searchTerm, tableDiv) {
  var filteredList = []
  data.forEach(function(object) {
    var stringObject = JSON.stringify(object).toLowerCase()
    if (stringObject.match(searchTerm.toLowerCase())) filteredList.push(object)
  })
  if (filteredList.length === 0) {
    console.log("no matchie")
    $(".noMatches").css("visibility", "inherit")
    makeTable("no matches", tableDiv)
  }
  else $(".noMatches").css("visibility", "hidden")
  makeTable(filteredList, tableDiv) 
  return filteredList
}

function sortThings(data, sorter, sorted, tableDiv) {
  data.sort(function(a,b){
    if (a[sorter]<b[sorter]) return -1
    if (a[sorter]>b[sorter]) return 1
    return 0
  })
  if (sorted === "descending") data.reverse()
  makeTable(data, tableDiv)
  var header 
  $(tableDiv + " .tHeader").each(function(i, el){
    var contents = resolveDataTitle($(el).text())
    if (contents === sorter) header = el
  })
  $(header).attr("data-sorted", sorted)
}

function resolveDataTitle(string) {
  var adjusted = string.toLowerCase().replace(/\s/g, '').replace(/\W/g, '')
  return adjusted
}

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
  sortThings(gData, sorter, sorted, tableDiv)
}

$(document).on("click", ".tHeader", sendToSort)

function makeTable(data, targetDiv, showRows) {
  if (!showRows) table(data, targetDiv)
  var allRows = data.length
  var totalPages = Math.floor(allRows / showRows)
  var currentPage = 1
  var currentStart = (currentPage * showRows) - showRows
  var currentEnd = currentPage * showRows
  var currentRows = data.splice(currentStart, currentEnd)
  table(currentRows, targetDiv)
  setPreNext(targetDiv, currentPage, currentPage, totalPages)
  
  $(document).on("click", (".pagination-next"), function() { 
    console.log("clicked next!")
    currentPage = currentPage + 1
    var nextPage = currentPage + 1
    currentStart = (currentPage * showRows) - showRows
    currentEnd = currentPage * showRows
    currentRows = data.slice(currentStart, currentEnd)
    table(currentRows, targetDiv)
    setPreNext(targetDiv, currentPage, currentPage, totalPages)
  })

  $(document).on("click", (".pagination-pre"), function() { 
    console.log("clicked next!")
    currentPage = currentPage - 1
    var nextPage = currentPage + 1
    currentStart = (currentPage * showRows) - showRows
    currentEnd = currentPage * showRows
    currentRows = data.slice(currentStart, currentEnd) 
    table(currentRows, targetDiv)
    setPreNext(targetDiv, currentPage, currentPage, totalPages)
  })
}

function setPreNext(targetDiv, currentPage, currentPage, totalPages) {
  $(targetDiv).append("<div pageno='" + currentPage + "'" + "class='table-pagination'>Showing page " 
    + currentPage + " of " + totalPages + " <a class='pagination-pre'>Previous</a>" +
    " <a class='pagination-next'>Next</a></p></div>" )
}

function rowRanges(allRows, showRows) {
  var pages = Math.ceil(allRows / showRows)
  var rowRanges = []
  for (var i = 1; i <=   pages; i++) { 
    var start = (i * showRows) - 1
    if (i === 1) var start = 0
    var end = i * showRows
    var range = {}
    range[i] = {"start": start, "end": end}
    rowRanges.push(range)
  }
  console.log("ranges!", rowRanges)
  return rowRanges
}

function table(data, targetDiv) {
  var templateID = targetDiv.replace("#", "")
  var tableContents = ich[templateID]({
    rows: data
  })
  $(targetDiv).html(tableContents)
}

$(".pagination-next").on("click", function() { 
  console.log("clicked next!")
  var currentPage = $(".table-pagination").attr("pageno")
  var nextPage = currentPage + 1
  pageno = nextPage
  var lastRange = currentPage * pagination
  var displayRange = pageno
})

// function makeTable(data, targetDiv, pagination) {
//   if (!pagination) var showRows = data.length
//   var showRows = pagination
//   var allRows = data.length
//   var pages = allRows / showRows
//   var pageno = 1
//   console.log("show rows", showRows, "allRows", allRows, "pages", pages)
//   var templateID = targetDiv.replace("#", "")
//   var tableContents = ich[templateID]({
//     rows: data.slice(0, showRows)
//   })
//   $(targetDiv).html(tableContents)
//   if (pagination) {
//     $(targetDiv).append("<span pageno='1' class='table-pagination'>Showing " 
//       + showRows + "of " + allRows + "<a class='pagination-pre'> Previous</a> <a class='pagination-next'>Next</a> </p>" )
//   }
//   if (pageno === 1) $(".pagination-pre").css("display", "none")
//   $(".pagination-pre").on("click", function() { 
//     console.log("clicked!")
//     var currentPage = $(".table-pagination").attr("pageno")
//     var previousPage = currentPage - 1
//     pageno = previousPage
//   })
//   $(".pagination-next").on("click", function() { 
//     console.log("clicked next!")
//     var currentPage = $(".table-pagination").attr("pageno")
//     var nextPage = currentPage + 1
//     pageno = nextPage
//     var lastRange = currentPage * pagination
//     var displayRange = pageno
//   })
// }


// tables
exports.searchTable = searchTable
exports.initiateTableFilter = initiateTableFilter
exports.makeTable = makeTable
exports.sendToSort = sendToSort
exports.resolveDataTitle = resolveDataTitle
exports.sortThings = sortThings
}
var Sheetsee = {}
exportFunctions(Sheetsee)

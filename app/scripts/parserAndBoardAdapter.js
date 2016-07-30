class ParserAndBoardAdapter {
  adaptToBoard(table) {
    const mapColor = (index, color) => {
      return table[index].map((rows) => {
        return rows.map((amount) => {
          var cell = {};
          cell[color] = amount;
          return cell;
        });
      });
    };

    const blueColumns = mapColor(0, "blue");
    const redColumns = mapColor(1, "red");
    const blackColumns = mapColor(2, "black");
    const greenColumns = mapColor(3, "green");

    return _(blueColumns)
      .zipWith(redColumns, blackColumns, greenColumns, _.merge)
      .unzip()
      .reverse()
      .value()
  }
}

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // METHODS
  filter() {
    try {
      console.log("Query String:", this.queryString);
      let queryObj = { ...this.queryString };
      console.log("Query Object:", queryObj);
      console.log("Query object before:", queryObj);
      const excludedFields = ["page", "sort", "limit", "fields"];
      excludedFields.forEach((field) => delete queryObj[field]);
      console.log("Query object after:", queryObj);

      // Add $ to gte, gt, lte, and lt
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)/g, (match) => `$${match}`);

      // Execute filtered query
      this.query.find(JSON.parse(queryStr));
    } catch (err) {
      console.log("Failed to filter query!");
      console.log(`Error: ${err}`);
    }
    return this;
  }

  sort() {
    try {
      if (this.queryString.sort) {
        let sortBy = this.queryString.sort.replace(",", " ");
        this.query.sort(sortBy);
      } else {
        this.query.sort("fname");
      }
    } catch (err) {
      console.log("Failed to sort query!");
      console.log(`Error: ${err}`);
    }
    return this;
  }

  limitFields() {
    try {
      if (this.queryString.fields) {
        let selected = this.queryString.fields.replace(",", " ");
        this.query.select(selected);
      } else {
        this.query.select("-__v");
      }
    } catch (err) {
      console.log("Failed to limit the fields of the query!");
      console.log(`Error: ${err}`);
    }
    return this;
  }

  paginate() {}
}

module.exports = APIFeatures;

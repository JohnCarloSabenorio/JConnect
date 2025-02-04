class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // METHODS
  filter() {
    try {
      console.log("Query String:", this.queryString);
      // 1. Converts query string into an object
      let queryObj = { ...this.queryString };

      // 2. Exclude fields that are used for the api features
      const excludedFields = ["page", "sort", "limit", "fields"];
      excludedFields.forEach((field) => delete queryObj[field]);

      // 3. Add $ to gte, gt, lte, and lt in the queries
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)/g, (match) => `$${match}`);

      // 4. Convert the queryString into an object and execute the query
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

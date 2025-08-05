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

      // Exclude pagination/sorting fields
      const excludedFields = ["page", "sort", "limit", "fields"];
      excludedFields.forEach((field) => delete queryObj[field]);

      // Convert query string to JSON and replace gt/gte/lt/lte with MongoDB operators
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );

      let parsedQuery = JSON.parse(queryStr);

      // Handle filtering based on the length of `users` array
      console.log("THE QUERY STRINGS:");
      console.log(queryStr);
      if (parsedQuery.minUsers !== undefined) {
        parsedQuery = {
          $expr: { $gt: [{ $size: "$users" }, Number(parsedQuery.minUsers)] },
        };
      } else if (parsedQuery.maxUsers !== undefined) {
        parsedQuery = {
          $expr: { $eq: [{ $size: "$users" }, Number(parsedQuery.maxUsers)] },
        };
      }

      // Execute query
      this.query.find(parsedQuery);
    } catch (err) {
      console.log("Failed to filter query!");
      console.log(`Error: ${err}`);
    }
    return this;
  }

  sort() {
    try {
      console.log("THE QUERY STRING SORT:", this.queryString?.sort);
      if (this.queryString.sort) {
        let sortBy = this.queryString.sort.replace(",", " ");
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort("fname");
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

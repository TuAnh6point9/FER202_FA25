import React from 'react';

function BookingForm() {
  return (
    <div className="booking-form text-white py-5" style={{background:"#333"}}>
      <div className="container">
        <h3 className="mb-4 text-center">Book Your Table</h3>
        <form>
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="Your Name *" required />
            </div>
            <div className="col-md-4">
              <input type="email" className="form-control" placeholder="Your Email *" required />
            </div>
            <div className="col-md-4">
              <select className="form-select">
                <option>Select a Service</option>
                <option>Lunch</option>
                <option>Dinner</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <textarea className="form-control" rows="3" placeholder="Please write your comment"></textarea>
          </div>
          <div className="text-start">
            <button type="submit" className="btn btn-warning">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;


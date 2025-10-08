import  Button from "react-bootstrap/Button";
import "./Footer.css";

function MyFooter({author, email, linkGithub}) {
  return (
    <footer>
      <p>Author: Nguyen Dinh Anh Tuan</p>
      <p>Created by: nguyendinhanhtuan0609@gmail.com </p>
      <p>&copy; {new Date().getFullYear()} TraLTB. All rights reserved </p>
      <Button variant="link" href="" >My Link Github: https://github.com/TuAnh6point9/FER202_FA25.git </Button>
    </footer>
  )
}
export default MyFooter;



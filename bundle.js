const input = document.querySelector('input[type="file"]');
//Event listener
input.addEventListener(
  "change",
  (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.src = reader.result;
      image.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        data = imageData.data;
        let rowCounter = 0;
        let counter = 0;
        for (let i = 0; i < data.length; i += 4) {
          const average =
            (contrast(data[i], 51) +
              contrast(data[i + 1], 51) +
              contrast(data[i + 2], 51)) /
            3;

          data[i + 0] = average;
          data[i + 1] = average;
          data[i + 2] = average;
          pixels[rowCounter].push(average);
          if (counter >= canvas.width - 1 && rowCounter + 1 < canvas.height) {
            counter = 0;
            rowCounter++;
            pixels.push([]);
          } else {
            counter++;
          }
        }

        setCharacters();
        ctx.putImageData(imageData, 0, 0);
        document.body.appendChild(canvas);

        //output div
        let myDiv = document.createElement("div");
        myDiv.style.backgroundColor = "white";
        myDiv.style.fontFamily = "Courier New";
        myDiv.style.letterSpacing = -1;
        myDiv.style.lineHeight = -2;
        myDiv.id = "output";
        drawCharacters(myDiv);
        document.body.appendChild(myDiv);
      };
    };
    reader.readAsDataURL(input.files[0]);
    input.style.display = "none";
    document.getElementById("stuff").style.display = "none";
  },
  false
);

//pixel
let pixels = [[]];
const characters = {
  0: ".",
  1: ",",
  13: "^",
  15: "{",
  12: "/",
  16: "0",
  10: "o",
  11: "d",
  2: "x",
  3: "N",
  4: "$",
  9: "y",
  5: "X",
  6: "@",
  7: "#",
  8: "%",
  14: "W",
};
let characterArray;
function setCharacters() {
  //console.log(2);
  characterArray = pixels.map((row) => {
    return row.map((value) => {
      if (value < 10) {
        return 14;
      } else if (value < 20) {
        return 8;
      } else if (value < 35) {
        return 7;
      } else if (value < 45) {
        return 6;
      } else if (value < 55) {
        return 5;
      } else if (value < 67) {
        return 4;
      } else if (value < 87) {
        return 9;
      } else if (value < 129) {
        return 3;
      } else if (value < 171) {
        return 2;
      } else if (value < 181) {
        return 11;
      } else if (value < 192) {
        return 10;
      } else if (value < 202) {
        return 16;
      } else if (value < 212) {
        return 12;
      } else if (value < 217) {
        return 15;
      } else if (value < 222) {
        return 13;
      } else if (value < 233) {
        return 1;
      } else {
        return 0;
      }
    });
  });
}
function drawCharacters(div) {
  let string = "";
  for (let i = 0; i < characterArray.length; i++) {
    for (let j = 0; j < characterArray[i].length; j++) {
      string += characters[characterArray[i][j]];
    }
    div.innerHTML += string + "<br>";
    string = "";
  }
}
function contrast(colourValue, contrastFactor) {
  const f = (259 * (contrastFactor + 255)) / (255 * (259 - contrastFactor));
  return truncate(f * (colourValue - 128) + 128);
}
function truncate(colourValue) {
  if (colourValue > 255) {
    return 255;
  } else if (colourValue < 0) {
    return 0;
  } else {
    return colourValue;
  }
}

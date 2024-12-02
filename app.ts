import fs from "fs";
import fsPromise from "fs/promises";

// write a file of i million numbers using the file system
// execution time: 38.s
// total ram used: 50mb
const writeFileInPromise = async () => {
  console.time("writeFileInPromise");
  const file = await fsPromise.open("text.txt", "w");
  for (let i = 0; i < 1_000_000; i++) {
    const text = ` ${i} `;
    await file.write(text);
  }
  console.timeEnd("writeFileInPromise");
};

// write a file of i million numbers using the file system with non-
// execution time: 6.s
// total ram used: 30mb
const writeFile = () => {
  console.time("writeFile");
  const file = fs.open("text.txt", "w", (err, fd) => {
    if (err) {
      console.error(err.message);
      return;
    }
    for (let i = 0; i < 1_000_000; i++) {
      const text = ` ${i} `;
      fs.writeSync(fd, text);
    }
  });

  console.timeEnd("writeFile");
};

// write a file of 1 million numbers with using file streams
// execution time: 600ms
// total ram used: 300mb
const writeFileWithStreams = () => {
  console.time("writeFileWithStreams");
  const fileStream = fs.createWriteStream("text.txt", { encoding: "utf-8" });
  console.log(
    "🚀 ~~ file: app.ts:40 ~~ writeFileWithStreams ~~ fileStream.writableHighWaterMark:",
    fileStream.writableHighWaterMark
  );

  for (let i = 0; i < 1_000_000; i++) {
    const text = ` ${i} `;
    const isWrite = fileStream.write(text);

    // if (!isWrite) {
    //   console.log("🚀 ~~ file: app.ts:47 ~~ writeFileWithStreams ~~ isWrite:", isWrite);
    // }
  }
  console.timeEnd("writeFileWithStreams");
};

// write a file of 1 million numbers with using file streams
// execution time: 600ms
// total ram used: 300mb
const writeFileWithStreamsCheckingDrain = () => {
  console.time("writeFileWithStreamsCheckingDrain");
  const fileStream = fs.createWriteStream("text.txt", { encoding: "utf-8" });
  console.log(fileStream.writableHighWaterMark);

  let i = 0;

  runStreamAMillionTimes();

  fileStream.on("drain", () => {
    // console.log("This has finished in the buffer");
    runStreamAMillionTimes();
  });

  fileStream.on("close", () => {
    console.log("🚀 ~~ file: app.ts:78 ~~ fileStream.on ~~ close:", "close");
    console.timeEnd("writeFileWithStreamsCheckingDrain");
  });

  // fileStream.on("")

  // fileStream.on("drain", () => {

  //   console.log("This has finished in the buffer");
  // });

  function runStreamAMillionTimes() {
    while (i < 1000000) {
      const text = ` ${i} `;

      if (i === 9999999) {
        fileStream.end(text);
        break;
      }

      const isWrite = fileStream.write(text);

      if (!isWrite) {
        break;
      }

      i++;
    }
  }
};

// writeFileInPromise();
// writeFile();
// writeFileWithStreams();
writeFileWithStreamsCheckingDrain();

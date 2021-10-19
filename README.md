# discord
A filesystem that runs on discord's channels messages.

![image](https://user-images.githubusercontent.com/45743294/137827766-abf4ef30-4258-4af3-83c7-e4c2312cbda2.png)

This file manager creates folders and file structors using basic path algos
**ex:** `/root/path/to/file.txt`

Once started, it will auto create two channels in the guild given if they arent existing
`fs-files` and `fs-chunks`

Files are uploaded as binary 8mb or less chunks in `fs-chunks`
File descriptor data is uploade in `fs-files` and [__**localStorage**__](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### Creating a dir/folder
click the **create** button and add `/` at the end of the input data
**ex:** `folder/`
*Not adding the `/` at the end will create a file*

### Creating a File
click the **create** button put in the file name and click the upload file button and selecte your file to upload
**name ex:** `file.txt`
*adding a `/` at the end will create a dir/folder*

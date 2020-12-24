import os
from PIL import Image, ImageDraw, ImageFont, UnidentifiedImageError

# The reason this looks like this was for another project is because it is from another project and I changed some
# directories around. If you want to use it change directory to where you're storing uncompressed files
# Target sets resolution, quality sets compression in %.

# Also look, Python in Starmap's source code. One step closer to Python domination.

directory = r"C:\Users\alexc\Documents\GitHub\Work\Starmap-Front\public\assets\skybox\uncompressed"

fileCount = 0
for filename in os.listdir(directory):
    fileCount += 1

i = 0

target = int(input("Target > "))

qualitySet = int(input("Quality > "))

for filename in os.listdir(directory):
    try:
        i += 1
        image = Image.open(directory + "\\" + filename)

        x, y = image.size

        ################################

        multiplier = 1

        if x > y:

            newy = y

            while newy > target:
                multiplier = multiplier - 0.0001
                newy = y * multiplier
                # print(str(newy))

            newx = x * multiplier

        if y > x:
            newx = x

            while newx > target:
                multiplier = multiplier - 0.0001
                newx = x * multiplier
                # print(str(newx))

            newy = y * multiplier

        if target == x and target == y:
            newy = target
            newx = target

        ################################

        newImage = image.resize((int(newx + 1), int(newy + 1)))

        newImage = newImage.convert("RGB")

        print(str(filename))

        savePath = (directory + filename.replace("png", "jpg")).replace("uncompressed", "")
        newImage.save(savePath, "JPEG", quality=qualitySet)

        percentage = 100 * i / fileCount

        print(filename + " : " + str(percentage) + "%")
    except PermissionError:
        continue

    except UnidentifiedImageError:
        print("Error: File not an image...")
        continue
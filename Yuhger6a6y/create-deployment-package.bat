@echo off
echo Creating deployment package for Yuhger6a6y website...
echo.

REM Create deployment directory structure
mkdir "deployment-package\about-photography"
mkdir "deployment-package\album-timeline"
mkdir "deployment-package\contact"
mkdir "deployment-package\gallery"
mkdir "deployment-package\images"
mkdir "deployment-package\player"
mkdir "deployment-package\styles"

REM Copy main files
copy "*.html" "deployment-package\"
copy "*.css" "deployment-package\"
copy "*.js" "deployment-package\"
copy "vercel.json" "deployment-package\"
copy "README.md" "deployment-package\"
copy ".gitignore" "deployment-package\"

REM Copy subdirectories
xcopy "about-photography\*.*" "deployment-package\about-photography\" /E /I
xcopy "album-timeline\*.*" "deployment-package\album-timeline\" /E /I
xcopy "contact\*.*" "deployment-package\contact\" /E /I
xcopy "gallery\*.*" "deployment-package\gallery\" /E /I
xcopy "images\*.*" "deployment-package\images\" /E /I
xcopy "player\*.*" "deployment-package\player\" /E /I
xcopy "styles\*.*" "deployment-package\styles\" /E /I

echo.
echo Deployment package created successfully!
echo Upload the contents of the 'deployment-package' folder to Vercel.
echo.
echo Steps to deploy:
echo 1. Go to https://vercel.com
echo 2. Sign up or log in
echo 3. Click "New Project"
echo 4. Choose "Import" or "Other"
echo 5. Upload the files from the deployment-package folder
echo 6. Click "Deploy"
echo.
pause
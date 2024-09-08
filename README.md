# La Porta d'Acqua v2 - Angular

This is the frontend of the second version of [laportadacqua.com](https://laportadacqua.com).

It's written in Angular (v17+).

I'm going to use some libraries:
- Tailwind
- TaigaUi
- @angular/localize
- (probably) @angular/material

Using node `v20.10.0` and npm `10.2.3`

# Preferences and Settings

Preferences and Settings are the same thing.

The only difference is that Preferences are user-specific settings, while Settings are application-wide settings.

## Localization
`ng extract-i18n` will generate the .xlf file with all the translations inside `localize` folder.

### Translating
If you want to translate application manually, you can use a tool like [poeditor.com](https://poeditor.com).
In that case you may want to select only the "missing" translations. For that you can se `scripts/xlf-missing`. See the file for docs.

Otherwise you can translate the entire file using OpenAI capabilities. Just create a OpenAI key, add it to `scripts/.openai`, and run `ruby scripts/xlf-translate.rb locales/messages.xlf locales/messages.en.xlf`.

### After done translating

When you're done translating, you should have the localization files inside `locales` folder in the root of the project.

You can build the application with `./scripts/build.sh`.

Then, if you want to push to build repository, you can run `./scripts/push.sh`. Ensure you have cloned the build repository inside `../build-angular-lpda2` folder.

## Local build
For testing local builds, I build the application with `ng build` and then copy it to `/var/www/lpda2` folder.

I then serve it with nginx. See production repository for nginx configuration.

```bash
ng build -c development --localize

./scripts/adjust-configs.sh

sudo rm -rf /var/www/lpda2/* && sudo cp -r dist/lpda2/* /var/www/lpda2/ && sudo chown www-data:www-data -R /var/www/lpda2/
```

## Poeditor
Login to [poeditor.com](https://poeditor.com)
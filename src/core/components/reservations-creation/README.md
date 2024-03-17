# Reservation creation components

## admin-reservation-form
Just the form for editing a Reservation's details.

Can be used both for create and update.

## create-reservation
Common component for creating a reservation.

After done or cancel, does not navigate anywhere, just
emits the event.

`(created)` - Emits the created reservation.

`(cancelled)` - Emits when the user cancels the creation.

## create-reservation-routable
Routable page for creating a reservation.

Looks like a modal, but is actually a page.

## create-reservation-modal
Is designed to be used as a modal, with
[Tui Component Dialog](https://taiga-ui.dev/components/dialog#data)

```ts
private readonly dialogs: TuiDialogService = inject(TuiDialogService);
private readonly injector: Injector = inject(Injector);
// ...
this.dialogs.open<Reservation | null>(
  new PolymorpheusComponent(CreateReservationModalComponent, this.injector),
).pipe(
  takeUntil(this.destroy$)
).subscribe({
  next: (result: Reservation | null): void => {
    console.log(`dialog result`, {result});
  },
  error: (error: any): void => console.error(error),
})
```
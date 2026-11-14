import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render } from "@testing-library/react-native";
import { FavoriteButton } from "../FavoriteButton";

describe("FavoriteButton", () => {
  it("expone el estado seleccionado y su etiqueta accesible", async () => {
    const { getByRole } = await render(<FavoriteButton activo onPress={() => undefined} />);
    const boton = getByRole("button", { name: "Quitar de favoritos" });
    expect(boton.props.accessibilityState).toEqual({ selected: true, disabled: false });
  });

  it("cambia de etiqueta cuando no es favorito", async () => {
    const { getByRole } = await render(<FavoriteButton activo={false} onPress={() => undefined} />);
    const boton = getByRole("button", { name: "Añadir a favoritos" });
    expect(boton.props.accessibilityState).toEqual({ selected: false, disabled: false });
  });

  it("llama a onPress y respeta disabled", async () => {
    const onPress = jest.fn();
    const { getByRole, rerender } = await render(
      <FavoriteButton activo={false} onPress={onPress} />,
    );
    fireEvent.press(getByRole("button", { name: "Añadir a favoritos" }));
    expect(onPress).toHaveBeenCalledTimes(1);

    await rerender(<FavoriteButton activo={false} onPress={onPress} disabled />);
    fireEvent.press(getByRole("button", { name: "Añadir a favoritos" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
